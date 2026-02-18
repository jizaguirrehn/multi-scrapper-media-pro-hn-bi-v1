
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import ScrapeResult, ScraperKey
from .serializers import ScrapeResultSerializer, ScraperKeySerializer
# Import the existing scripts as utility modules
# from scripts.Ig.script import iniciar as iniciar_ig
# from scripts.Tk.script import iniciar as iniciar_tk
# from scripts.X.script import iniciar as iniciar_x

class ScraperViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'])
    def trigger_extraction(self, request):
        platform = request.data.get('platform')
        targets = request.data.get('targets', [])
        
        if not platform or not targets:
            return Response({'error': 'Missing parameters'}, status=status.HTTP_400_BAD_REQUEST)
        
        # 1. Fetch active keys from DB
        keys = ScraperKey.objects.filter(platform=platform, is_active=True).values_list('key_value', flat=True)
        
        # 2. Call the adapted Python scripts
        # NOTE: In Django, use Celery to run these asynchronously!
        # if platform == 'ig':
        #     iniciar_ig(list(keys), targets)
        
        return Response({'status': 'Extraction started', 'count': len(targets)})

    @action(detail=False, methods=['get'])
    def latest_results(self, request):
        queryset = ScrapeResult.objects.all()[:50]
        serializer = ScrapeResultSerializer(queryset, many=True)
        return Response(serializer.data)
