from rest_framework_nested import routers
from django.urls import path, include
from .views import MovieViewSet, ReviewViewSet, RatingViewSet, CommentViewSet

router = routers.DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')

movies_router = routers.NestedDefaultRouter(router, r'movies', lookup='movie')
movies_router.register(r'reviews', ReviewViewSet, basename='movie-reviews')
movies_router.register(r'ratings', RatingViewSet, basename='movie-ratings')

reviews_router = routers.NestedDefaultRouter(movies_router, r'reviews', lookup='review')
reviews_router.register(r'comments', CommentViewSet, basename='review-comments')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(movies_router.urls)),
    path('', include(reviews_router.urls)),
]