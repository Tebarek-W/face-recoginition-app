from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
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
            'role'
        ]
        read_only_fields = fields

    def get_avatar_url(self, obj):
        if obj.avatar:
            return f"{settings.MEDIA_URL}{obj.avatar}"
        return None

class UserWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'avatar',
            'role'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }