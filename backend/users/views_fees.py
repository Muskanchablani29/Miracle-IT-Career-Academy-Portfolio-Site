from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    FeeStructure, FeeInstallment, StudentFee, FeePayment, 
    FeeDiscount, FeeFine, Student, CustomUser
)
from .serializers import (
    FeeStructureSerializer, FeeInstallmentSerializer, StudentFeeSerializer,
    FeePaymentSerializer, FeeDiscountSerializer, FeeFineSerializer
)

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class IsFacultyUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'faculty'

class IsStudentUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class FeeStructureViewSet(viewsets.ModelViewSet):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    permission_classes = [IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_installment(self, request, pk=None):
        fee_structure = self.get_object()
        serializer = FeeInstallmentSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(fee_structure=fee_structure)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def installments(self, request, pk=None):
        fee_structure = self.get_object()
        installments = fee_structure.installments_list.all()
        serializer = FeeInstallmentSerializer(installments, many=True)
        return Response(serializer.data)

class StudentFeeViewSet(viewsets.ModelViewSet):
    serializer_class = StudentFeeSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create', 'update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'admin':
            return StudentFee.objects.all()
        elif user.role == 'faculty':
            # Faculty can see fees of students in their batches/courses
            return StudentFee.objects.filter(
                student__batch__in=user.faculty_profile.batches.all()
            ) if hasattr(user, 'faculty_profile') else StudentFee.objects.none()
        elif user.role == 'student':
            # Students can only see their own fees
            try:
                student = user.student_profile
                return StudentFee.objects.filter(student=student)
            except:
                return StudentFee.objects.none()
        return StudentFee.objects.none()
    
    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        student_fee = self.get_object()
        serializer = FeePaymentSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save(student_fee=student_fee)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        student_fee = self.get_object()
        payments = student_fee.payments.all()
        serializer = FeePaymentSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_discount(self, request, pk=None):
        student_fee = self.get_object()
        serializer = FeeDiscountSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(student_fee=student_fee, applied_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_fine(self, request, pk=None):
        student_fee = self.get_object()
        serializer = FeeFineSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(student_fee=student_fee, applied_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeePaymentViewSet(viewsets.ModelViewSet):
    queryset = FeePayment.objects.all()
    serializer_class = FeePaymentSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'admin':
            return FeePayment.objects.all()
        elif user.role == 'faculty':
            # Faculty can see payments of students in their batches/courses
            return FeePayment.objects.filter(
                student_fee__student__batch__in=user.faculty_profile.batches.all()
            ) if hasattr(user, 'faculty_profile') else FeePayment.objects.none()
        elif user.role == 'student':
            # Students can only see their own payments
            try:
                student = user.student_profile
                return FeePayment.objects.filter(student_fee__student=student)
            except:
                return FeePayment.objects.none()
        return FeePayment.objects.none()
    
    @action(detail=False, methods=['get'])
    def download_receipt(self, request):
        receipt_number = request.query_params.get('receipt_number')
        if not receipt_number:
            return Response({"error": "Receipt number is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payment = FeePayment.objects.get(receipt_number=receipt_number)
            # In a real implementation, generate a PDF receipt here
            return Response({
                "receipt_number": payment.receipt_number,
                "student_name": payment.student_fee.student.user.username,
                "amount": payment.amount,
                "payment_date": payment.payment_date,
                "payment_mode": payment.payment_mode,
                "status": payment.status
            })
        except FeePayment.DoesNotExist:
            return Response({"error": "Receipt not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminFeeReportView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        # Get query parameters for filtering
        course_id = request.query_params.get('course_id')
        batch_id = request.query_params.get('batch_id')
        status = request.query_params.get('status')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        # Base queryset
        queryset = StudentFee.objects.all()
        
        # Apply filters
        if course_id:
            queryset = queryset.filter(student__course_id=course_id)
        if batch_id:
            queryset = queryset.filter(student__batch_id=batch_id)
        if status:
            queryset = queryset.filter(status=status)
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            queryset = queryset.filter(assigned_date__gte=start_date)
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            queryset = queryset.filter(assigned_date__lte=end_date)
        
        # Calculate summary statistics
        total_fees = queryset.aggregate(total=Sum('total_amount'))['total'] or 0
        total_paid = queryset.aggregate(paid=Sum('amount_paid'))['paid'] or 0
        total_pending = total_fees - total_paid
        
        # Get fee status counts
        status_counts = queryset.values('status').annotate(count=Count('id'))
        
        # Get recent payments
        recent_payments = FeePayment.objects.filter(
            student_fee__in=queryset
        ).order_by('-payment_date')[:10]
        
        # Serialize the data
        payment_serializer = FeePaymentSerializer(recent_payments, many=True)
        
        return Response({
            'summary': {
                'total_fees': total_fees,
                'total_paid': total_paid,
                'total_pending': total_pending,
                'collection_rate': (total_paid / total_fees * 100) if total_fees > 0 else 0
            },
            'status_counts': status_counts,
            'recent_payments': payment_serializer.data
        })

class StudentFeeDetailView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.role != 'student':
            return Response({"error": "Only students can access this endpoint"}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        try:
            student = user.student_profile
            fees = StudentFee.objects.filter(student=student)
            
            if not fees.exists():
                return Response({"message": "No fee records found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Get the latest fee record
            latest_fee = fees.latest('assigned_date')
            
            # Get all payments for this student
            payments = FeePayment.objects.filter(student_fee__in=fees).order_by('-payment_date')
            
            # Calculate due amount
            total_amount = latest_fee.total_amount
            amount_paid = latest_fee.amount_paid
            due_amount = total_amount - amount_paid
            
            # Get next installment due date
            next_installment = FeeInstallment.objects.filter(
                fee_structure=latest_fee.fee_structure,
                due_date__gt=timezone.now().date()
            ).order_by('due_date').first()
            
            next_due_date = next_installment.due_date if next_installment else None
            
            # Serialize the data
            fee_serializer = StudentFeeSerializer(latest_fee)
            payment_serializer = FeePaymentSerializer(payments, many=True)
            
            return Response({
                'fee_details': fee_serializer.data,
                'total_amount': total_amount,
                'amount_paid': amount_paid,
                'due_amount': due_amount,
                'next_due_date': next_due_date,
                'payment_history': payment_serializer.data
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FacultyStudentFeeView(generics.GenericAPIView):
    permission_classes = [IsFacultyUser]
    
    def get(self, request):
        batch_id = request.query_params.get('batch_id')
        
        if not batch_id:
            return Response({"error": "Batch ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all students in the batch
        students = Student.objects.filter(batch_id=batch_id)
        
        if not students.exists():
            return Response({"message": "No students found in this batch"}, 
                           status=status.HTTP_404_NOT_FOUND)
        
        # Get fee status for each student
        student_fees = []
        for student in students:
            fee = StudentFee.objects.filter(student=student).first()
            if fee:
                student_fees.append({
                    'student_id': student.id,
                    'student_name': student.user.username,
                    'enrollment_id': student.enrollment_id,
                    'total_amount': fee.total_amount,
                    'amount_paid': fee.amount_paid,
                    'status': fee.status,
                    'last_payment_date': fee.payments.order_by('-payment_date').first().payment_date if fee.payments.exists() else None
                })
            else:
                student_fees.append({
                    'student_id': student.id,
                    'student_name': student.user.username,
                    'enrollment_id': student.enrollment_id,
                    'total_amount': 0,
                    'amount_paid': 0,
                    'status': 'No fee assigned',
                    'last_payment_date': None
                })
        
        return Response(student_fees)