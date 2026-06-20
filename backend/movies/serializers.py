from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Movie, Review, Rating, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = Comment
        fields = ['id', 'user', 'body', 'created_at', 'updated_at']


class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = Rating
        fields = ['id', 'user', 'score', 'created_at', 'updated_at']


class ReviewSerializer(serializers.ModelSerializer):
    user     = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model  = Review
        fields = ['id', 'user', 'title', 'body', 'comments', 'created_at', 'updated_at']


class MovieSerializer(serializers.ModelSerializer):
    created_by     = UserSerializer(read_only=True)
    reviews        = ReviewSerializer(many=True, read_only=True)
    ratings        = RatingSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    image          = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model  = Movie
        fields = [
            'id', 'title', 'description', 'genre', 'release_year',
            'director', 'image', 'average_rating', 'created_by',
            'reviews', 'ratings', 'created_at', 'updated_at'
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()