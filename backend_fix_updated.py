from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F
from django.shortcuts import get_object_or_404

# Add this to your views.py file in your Django backend

class StudentFeeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing student fees.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter queryset based on user role:
        - Admin/Faculty: All student fees
        - Student: Only their own fees
        """
        user = self.request.user
        
        # Check if current_user filter is applied
        current_user = self.request.query_params.get('current_user', False)
        
        if user.is_staff or hasattr(user, 'faculty_profile'):
            # Admin or faculty can see all fees
            return StudentFee.objects.all()
        elif hasattr(user, 'student_profile'):
            # Students can only see their own fees
            return StudentFee.objects.filter(student=user.student_profile)
        else:
            # Default empty queryset
            return StudentFee.objects.none()
    
    def list(self, request, *args, **kwargs):
        """
        Override list method to include additional fee data for students
        """
        queryset = self.get_queryset()
        
        # For students, enhance the response with payment details
        if hasattr(request.user, 'student_profile') and not request.user.is_staff:
            student_fees = []
            
            for fee in queryset:
                # Calculate payments
                payments = FeePayment.objects.filter(student_fee=fee)
                amount_paid = payments.aggregate(Sum('amount'))['amount__sum'] or 0
                
                # Determine status
                if amount_paid >= fee.total_amount:
                    status = 'paid'
                elif amount_paid > 0:
                    status = 'partially_paid'
                else:
                    status = 'unpaid'
                
                # Add to response
                student_fees.append({
                    'id': fee.id,
                    'student': fee.student.id,
                    'student_name': f"{fee.student.user.first_name} {fee.student.user.last_name}",
                    'fee_structure': fee.fee_structure.id if fee.fee_structure else None,
                    'fee_structure_name': fee.fee_structure.name if fee.fee_structure else 'N/A',
                    'course': {
                        'id': fee.course.id if hasattr(fee, 'course') and fee.course else None,
                        'title': fee.course.title if hasattr(fee, 'course') and fee.course else 'N/A'
                    },
                    'registration_fee': fee.fee_structure.registration_fee if fee.fee_structure else 0,
                    'tuition_fee': fee.fee_structure.tuition_fee if fee.fee_structure else 0,
                    'total_amount': fee.total_amount,
                    'amount_paid': amount_paid,
                    'due_amount': fee.total_amount - amount_paid,
                    'status': status,
                    'created_at': fee.created_at
                })
            
            return Response(student_fees)
        
        # For admin/faculty, use standard serializer
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def student_details(self, request):
        """
        Get fee details for the current student.
        This endpoint is specifically for student dashboard.
        """
        if not hasattr(request.user, 'student_profile'):
            return Response({"error": "Not a student account"}, status=403)
            
        student = request.user.student_profile
        student_fees = StudentFee.objects.filter(student=student)
        
        if not student_fees.exists():
            return Response({"error": "No fee records found"}, status=404)
            
        # Calculate totals
        total_amount = student_fees.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Get all payments
        payments = FeePayment.objects.filter(student_fee__in=student_fees)
        amount_paid = payments.aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Calculate due amount
        due_amount = total_amount - amount_paid
        
        # Determine status
        if amount_paid >= total_amount:
            status = 'paid'
        elif amount_paid > 0:
            status = 'partially_paid'
        else:
            status = 'unpaid'
            
        # Return comprehensive fee data
        return Response({
            'total_amount': total_amount,
            'amount_paid': amount_paid,
            'due_amount': due_amount,
            'status': status,
            'fee_details': {
                'status': status
            }
        })

# Add this to your urls.py file:
"""
from rest_framework.routers import DefaultRouter
from .views import StudentFeeViewSet

router = DefaultRouter()
router.register(r'student-fees', StudentFeeViewSet, basename='student-fees')

urlpatterns = [
    # ... other URL patterns
    path('api/', include(router.urls)),
]
"""