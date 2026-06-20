from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Movie(models.Model):
    GENRE_CHOICES = [
        ('action', 'Action'),
        ('comedy', 'Comedy'),
        ('drama', 'Drama'),
        ('horror', 'Horror'),
        ('romance', 'Romance'),
        ('sci-fi', 'Sci-Fi'),
        ('thriller', 'Thriller'),
        ('animation', 'Animation'),
        ('documentary', 'Documentary'),
        ('other', 'Other'),
    ]

    title        = models.CharField(max_length=255)
    description  = models.TextField()
    genre        = models.CharField(max_length=50, choices=GENRE_CHOICES, default='other')
    release_year = models.IntegerField()
    director     = models.CharField(max_length=255)
    image        = models.ImageField(upload_to='movies/', blank=True, null=True)
    created_by   = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='movies')
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    def average_rating(self):
        ratings = self.ratings.all()
        if ratings.exists():
            return round(sum(r.score for r in ratings) / ratings.count(), 1)
        return 0.0

    def __str__(self):
        return self.title


class Review(models.Model):
    movie      = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    title      = models.CharField(max_length=255)
    body       = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('movie', 'user')

    def __str__(self):
        return f'{self.user.username} - {self.movie.title}'


class Rating(models.Model):
    movie      = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='ratings')
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    score      = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('movie', 'user')

    def __str__(self):
        return f'{self.user.username} rated {self.movie.title}: {self.score}/10'


class Comment(models.Model):
    review     = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='comments')
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    body       = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username} commented on {self.review.title}'