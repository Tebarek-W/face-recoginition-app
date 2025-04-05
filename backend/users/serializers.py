from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for user details
    Includes avatar URL and all user fields except password
    """
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'avatar_url',
            'role',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = fields

    def get_avatar_url(self, obj):
        if obj.avatar:
            return f"{settings.MEDIA_URL}{obj.avatar}"
        return None

class UserWriteSerializer(serializers.ModelSerializer):
    """
    Write serializer for user creation and updates
    Handles password hashing and required fields
    """
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'avatar',
            'role',
            'is_active'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'required': False}
        }

    def create(self, validated_data):
        # Handles password hashing automatically via create_user
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        # Handle password separately if provided
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)

class UserAuthSerializer(serializers.ModelSerializer):
    """
    Simplified serializer specifically for authentication flows
    (login/registration responses)
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']