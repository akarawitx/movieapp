from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User
from .models import Movie, Review, Rating, Comment
from .serializers import (
    MovieSerializer, ReviewSerializer,
    RatingSerializer, CommentSerializer, RegisterSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset           = User.objects.all()
    serializer_class   = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MovieViewSet(viewsets.ModelViewSet):
    queryset         = Movie.objects.all().order_by('-created_at')
    serializer_class = MovieSerializer
    parser_classes   = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Review.objects.filter(
            movie_id=self.kwargs['movie_pk']
        ).order_by('-created_at')

    def perform_create(self, serializer):
        from django.shortcuts import get_object_or_404
        movie = get_object_or_404(Movie, pk=self.kwargs['movie_pk'])
        serializer.save(user=self.request.user, movie=movie)


class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Rating.objects.filter(
            movie_id=self.kwargs['movie_pk']
        ).order_by('-created_at')

    def perform_create(self, serializer):
        from django.shortcuts import get_object_or_404
        movie = get_object_or_404(Movie, pk=self.kwargs['movie_pk'])
        serializer.save(user=self.request.user, movie=movie)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Comment.objects.filter(
            review_id=self.kwargs['review_pk']
        ).order_by('-created_at')

    def perform_create(self, serializer):
        from django.shortcuts import get_object_or_404
        review = get_object_or_404(Review, pk=self.kwargs['review_pk'])
        serializer.save(user=self.request.user, review=review)