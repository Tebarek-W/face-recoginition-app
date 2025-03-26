from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny  # Add this import
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from users.models import User  # Import from the correct app
from .serializers import UserSerializer

# Add the RegisterView class with AllowAny permission
class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allow access without authentication

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Existing LoginView and LogoutView classes
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': user.role,
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the token
            return Response(
                {"message": "Logged out successfully"},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": "Invalid or expired refresh token"},
                status=status.HTTP_400_BAD_REQUEST
            )

# Add the UserListView class to fetch all users
class UserListView(APIView):
    permission_classes = [AllowAny]  # Allow access without authentication (for now)

    def get(self, request):
        users = User.objects.all()  # Fetch all users from the database
        serializer = UserSerializer(users, many=True)  # Serialize the data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return the response

# Add the UserUpdateView class to update a user
class UserUpdateView(APIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)  # Find the user by ID
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Add the UserDeleteView class to delete a user
class UserDeleteView(APIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)  # Find the user by ID
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.delete()  # Delete the user
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)