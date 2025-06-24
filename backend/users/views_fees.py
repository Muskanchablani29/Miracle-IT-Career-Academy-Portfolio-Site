from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, viewsets
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from .models import (
    Student, FeeStructure, StudentFee, FeePayment, FeeInstallment
)
from .serializers import (
    StudentFeeSerializer, FeePaymentSerializer, FeeInstallmentSerializer, FeeStructureSerializer
)
from django.http import HttpResponse, FileResponse
import uuid
import io
try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import inch
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

class IsFacultyUser:
    def has_permission(self, request, view):
        return True

# Debug endpoint to test authentication
class AuthTestView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({
            "user": str(request.user),
            "is_authenticated": request.user.is_authenticated,
            "has_student_profile": hasattr(request.user, 'student_profile')
        })

@api_view(['GET'])
@permission_classes([AllowAny])
def download_receipt_view(request, receipt_number=None):
    try:
        if not receipt_number:
            receipt_number = request.GET.get('receipt_number')
        if not receipt_number:
            return Response({"error": "Receipt number required"}, status=status.HTTP_400_BAD_REQUEST)
        
        payment = FeePayment.objects.filter(receipt_number=receipt_number).first()
        if not payment:
            return Response({"error": "Receipt not found"}, status=status.HTTP_404_NOT_FOUND)
        

        
        if REPORTLAB_AVAILABLE:
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []
            
            title = Paragraph("<b>PAYMENT RECEIPT</b>", styles['Title'])
            story.append(title)
            story.append(Spacer(1, 20))
            
            receipt_data = [
                ['Receipt Number:', payment.receipt_number],
                ['Date:', payment.payment_date.strftime('%d/%m/%Y')],
                ['Student Name:', payment.student_fee.student.user.username],
                ['Amount Paid:', f'Rs. {payment.amount}'],
                ['Payment Mode:', payment.payment_mode.replace('_', ' ').title()],
                ['Status:', payment.status.title()],
            ]
            
            table = Table(receipt_data, colWidths=[2*inch, 3*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(table)
            doc.build(story)
            buffer.seek(0)
            
            response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="receipt-{receipt_number}.pdf"'
            return response
        else:
            receipt_data = {
                'receipt_number': payment.receipt_number,
                'date': payment.payment_date.strftime('%d/%m/%Y'),
                'student_name': payment.student_fee.student.user.username,
                'amount': str(payment.amount),
                'payment_mode': payment.payment_mode,
                'status': payment.status
            }
            return Response(receipt_data)
            
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def student_fee_detail_view(request):
    try:
        user = request.user
        if not user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
        if not hasattr(user, 'student_profile'):
            return Response({"error": "Student profile not found"}, status=status.HTTP_403_FORBIDDEN)

        student = user.student_profile
        
        # Get or create student fee record
        student_fee = StudentFee.objects.filter(student=student).first()
        
        if not student_fee:
            # If no fee record exists, try to create one based on student's course
            if student.course:
                fee_structure = FeeStructure.objects.filter(course=student.course).first()
                if fee_structure:
                    student_fee = StudentFee.objects.create(
                        student=student,
                        fee_structure=fee_structure,
                        total_amount=fee_structure.total_amount,
                        amount_paid=0,
                        assigned_by=None
                    )
                else:
                    return Response({
                        "error": "No fee structure found for your course. Please contact admin."
                    }, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({
                    "error": "No course assigned. Please contact admin."
                }, status=status.HTTP_404_NOT_FOUND)
        
        # Get installments
        installments = FeeInstallment.objects.filter(
            fee_structure=student_fee.fee_structure
        ).order_by('sequence')
        
        # Get payment history
        payments = FeePayment.objects.filter(
            student_fee=student_fee
        ).order_by('-payment_date')
        
        # Calculate next due date
        next_due_date = None
        if installments.exists():
            # Find the next unpaid installment
            total_paid = float(student_fee.amount_paid)
            cumulative_amount = 0
            for installment in installments:
                cumulative_amount += float(installment.amount)
                if total_paid < cumulative_amount:
                    next_due_date = installment.due_date
                    break
        
        # Prepare response data
        response_data = {
            'total_amount': float(student_fee.total_amount),
            'amount_paid': float(student_fee.amount_paid),
            'due_amount': float(student_fee.total_amount - student_fee.amount_paid),
            'next_due_date': next_due_date.isoformat() if next_due_date else None,
            'fee_details': {
                'id': student_fee.id,
                'fee_structure_name': student_fee.fee_structure.name,
                'status': student_fee.status,
                'assigned_date': student_fee.assigned_date.isoformat()
            },
            'installments': [{
                'id': inst.id,
                'amount': float(inst.amount),
                'due_date': inst.due_date.isoformat(),
                'sequence': inst.sequence
            } for inst in installments],
            'payment_history': [{
                'id': payment.id,
                'amount': float(payment.amount),
                'payment_date': payment.payment_date.isoformat(),
                'payment_mode': payment.payment_mode,
                'receipt_number': payment.receipt_number,
                'status': payment.status
            } for payment in payments]
        }
        
        return Response(response_data)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StudentFeeDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "message": "Class-based view working",
            "user_authenticated": request.user.is_authenticated if hasattr(request, 'user') else False
        })

class FacultyStudentFeeView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({"message": "Faculty fee view working"})

class AdminFeeReportView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({"message": "Admin fee report working"})

class FeeStructureViewSet(viewsets.ModelViewSet):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    permission_classes = [AllowAny]

class StudentFeeViewSet(viewsets.ModelViewSet):
    queryset = StudentFee.objects.all()
    serializer_class = StudentFeeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'], url_path='details')
    def details(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
                
            if not hasattr(user, 'student_profile'):
                return Response({"error": "Student profile not found"}, status=status.HTTP_403_FORBIDDEN)

            student = user.student_profile
            
            # Get or create student fee record
            student_fee = StudentFee.objects.filter(student=student).first()
            
            if not student_fee:
                # If no fee record exists, try to create one based on student's course
                if student.course:
                    fee_structure = FeeStructure.objects.filter(course=student.course).first()
                    if fee_structure:
                        student_fee = StudentFee.objects.create(
                            student=student,
                            fee_structure=fee_structure,
                            total_amount=fee_structure.total_amount,
                            amount_paid=0,
                            assigned_by=None
                        )
                    else:
                        return Response({
                            "error": "No fee structure found for your course. Please contact admin."
                        }, status=status.HTTP_404_NOT_FOUND)
                else:
                    return Response({
                        "error": "No course assigned. Please contact admin."
                    }, status=status.HTTP_404_NOT_FOUND)
            
            # Get installments
            installments = FeeInstallment.objects.filter(
                fee_structure=student_fee.fee_structure
            ).order_by('sequence')
            
            # Get payment history
            payments = FeePayment.objects.filter(
                student_fee=student_fee
            ).order_by('-payment_date')
            
            # Calculate next due date
            next_due_date = None
            if installments.exists():
                # Find the next unpaid installment
                total_paid = float(student_fee.amount_paid)
                cumulative_amount = 0
                for installment in installments:
                    cumulative_amount += float(installment.amount)
                    if total_paid < cumulative_amount:
                        next_due_date = installment.due_date
                        break
            
            # Return data in the exact format expected by frontend
            return Response({
                'total_amount': float(student_fee.total_amount),
                'amount_paid': float(student_fee.amount_paid),
                'due_amount': float(student_fee.total_amount - student_fee.amount_paid),
                'next_due_date': next_due_date.isoformat() if next_due_date else None,
                'fee_details': {
                    'id': student_fee.id,
                    'fee_structure_name': student_fee.fee_structure.name,
                    'status': student_fee.status,
                    'assigned_date': student_fee.assigned_date.isoformat()
                },
                'installments': [{
                    'id': inst.id,
                    'amount': float(inst.amount),
                    'due_date': inst.due_date.isoformat(),
                    'sequence': inst.sequence
                } for inst in installments],
                'payment_history': [{
                    'id': payment.id,
                    'amount': float(payment.amount),
                    'payment_date': payment.payment_date.isoformat(),
                    'payment_mode': payment.payment_mode,
                    'receipt_number': payment.receipt_number,
                    'status': payment.status
                } for payment in payments]
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FeePaymentViewSet(viewsets.ModelViewSet):
    queryset = FeePayment.objects.all()
    serializer_class = FeePaymentSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], url_path='make-payment')
    def make_payment(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
                
            if not hasattr(user, 'student_profile'):
                return Response({"error": "Student profile not found"}, status=status.HTTP_403_FORBIDDEN)

            student = user.student_profile
            student_fee = StudentFee.objects.filter(student=student).first()
            
            if not student_fee:
                return Response({"error": "No fee record found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Create payment record
            payment_data = {
                'student_fee': student_fee.id,
                'amount': request.data.get('amount'),
                'payment_mode': request.data.get('payment_mode', 'online'),
                'transaction_id': request.data.get('transaction_id', ''),
                'status': request.data.get('status', 'success'),
                'remarks': request.data.get('remarks', ''),
                'receipt_number': f"REC-{uuid.uuid4().hex[:8].upper()}"
            }
            
            serializer = self.get_serializer(data=payment_data)
            if serializer.is_valid():
                payment = serializer.save(recorded_by=user)
                return Response({
                    'message': 'Payment recorded successfully',
                    'payment': serializer.data
                })
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='download-receipt')
    def download_receipt(self, request):
        try:
            receipt_number = request.GET.get('receipt_number')
            if not receipt_number:
                return Response({"error": "Receipt number required"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get payment record
            payment = FeePayment.objects.filter(receipt_number=receipt_number).first()
            if not payment:
                return Response({"error": "Receipt not found"}, status=status.HTTP_404_NOT_FOUND)
            
            if REPORTLAB_AVAILABLE:
                # Generate PDF receipt
                buffer = io.BytesIO()
                doc = SimpleDocTemplate(buffer, pagesize=letter)
                styles = getSampleStyleSheet()
                story = []
                
                # Header
                title = Paragraph("<b>PAYMENT RECEIPT</b>", styles['Title'])
                story.append(title)
                story.append(Spacer(1, 20))
                
                # Receipt details
                receipt_data = [
                    ['Receipt Number:', payment.receipt_number],
                    ['Date:', payment.payment_date.strftime('%d/%m/%Y')],
                    ['Student Name:', payment.student_fee.student.user.username],
                    ['Enrollment ID:', payment.student_fee.student.enrollment_id],
                    ['Course:', payment.student_fee.student.course.title if payment.student_fee.student.course else 'N/A'],
                    ['Amount Paid:', f'Rs. {payment.amount}'],
                    ['Payment Mode:', payment.payment_mode.replace('_', ' ').title()],
                    ['Transaction ID:', payment.transaction_id or 'N/A'],
                    ['Status:', payment.status.title()],
                ]
                
                table = Table(receipt_data, colWidths=[2*inch, 3*inch])
                table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
                    ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                    ('BACKGROUND', (1, 0), (1, -1), colors.beige),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                
                story.append(table)
                story.append(Spacer(1, 30))
                
                # Footer
                footer = Paragraph("<i>This is a computer generated receipt.</i>", styles['Normal'])
                story.append(footer)
                
                doc.build(story)
                buffer.seek(0)
                
                response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="receipt-{receipt_number}.pdf"'
                return response
            else:
                # Fallback: return JSON with receipt data
                receipt_data = {
                    'receipt_number': payment.receipt_number,
                    'date': payment.payment_date.strftime('%d/%m/%Y'),
                    'student_name': payment.student_fee.student.user.username,
                    'enrollment_id': payment.student_fee.student.enrollment_id,
                    'course': payment.student_fee.student.course.title if payment.student_fee.student.course else 'N/A',
                    'amount': str(payment.amount),
                    'payment_mode': payment.payment_mode,
                    'transaction_id': payment.transaction_id or 'N/A',
                    'status': payment.status
                }
                return Response(receipt_data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], url_path='create-razorpay-order')
    def create_razorpay_order(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
                
            if not hasattr(user, 'student_profile'):
                return Response({"error": "Student profile not found"}, status=status.HTTP_403_FORBIDDEN)

            student = user.student_profile
            student_fee = StudentFee.objects.filter(student=student).first()
            
            if not student_fee:
                return Response({"error": "No fee record found"}, status=status.HTTP_404_NOT_FOUND)
            
            amount = float(request.data.get('amount', 0))
            if amount <= 0 or amount > student_fee.total_amount - student_fee.amount_paid:
                return Response({"error": "Invalid amount"}, status=status.HTTP_400_BAD_REQUEST)
            
            # For demo purposes, return mock Razorpay order
            # In production, you would integrate with actual Razorpay API
            order_data = {
                'id': f'order_{uuid.uuid4().hex[:10]}',
                'amount': int(amount * 100),  # Razorpay expects amount in paise
                'currency': 'INR',
                'status': 'created',
                'key': 'demo_key_only',  # Demo key - not for actual payment
                'student_name': student.user.username,
                'student_email': student.user.email,
                'contact': '9999999999',  # Demo contact
                'demo_mode': True  # Indicate this is demo mode
            }
            
            return Response(order_data)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], url_path='verify-razorpay-payment')
    def verify_razorpay_payment(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
                
            if not hasattr(user, 'student_profile'):
                return Response({"error": "Student profile not found"}, status=status.HTTP_403_FORBIDDEN)

            student = user.student_profile
            student_fee = StudentFee.objects.filter(student=student).first()
            
            if not student_fee:
                return Response({"error": "No fee record found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Get payment details from request
            razorpay_payment_id = request.data.get('razorpay_payment_id')
            razorpay_order_id = request.data.get('razorpay_order_id')
            razorpay_signature = request.data.get('razorpay_signature')
            amount = float(request.data.get('amount', 0))
            
            if not all([razorpay_payment_id, razorpay_order_id, amount]):
                return Response({"error": "Missing payment details"}, status=status.HTTP_400_BAD_REQUEST)
            
            # In production, you would verify the signature with Razorpay
            # For demo, we'll assume payment is successful
            
            # Create payment record
            payment = FeePayment.objects.create(
                student_fee=student_fee,
                amount=amount,
                payment_mode='online',
                transaction_id=razorpay_payment_id,
                receipt_number=f"REC-{uuid.uuid4().hex[:8].upper()}",
                status='success',
                remarks=f'Online payment via Razorpay - Order: {razorpay_order_id}',
                recorded_by=user
            )
            
            return Response({
                'message': 'Payment verified and recorded successfully',
                'receipt_number': payment.receipt_number,
                'payment_id': payment.id
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)