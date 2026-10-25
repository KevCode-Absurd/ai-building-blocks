"""
Social media metrics calculation module.
Provides functions to calculate engagement, reach, and ROI metrics.
"""

from typing import Dict, List, Any, Optional
from datetime import datetime


class SocialMediaMetricsCalculator:
    """Calculate social media performance metrics."""

    def __init__(self, campaign_data: Dict[str, Any]):
        """
        Initialize with campaign data.

        Args:
            campaign_data: Dictionary containing platform, posts, and cost data
        """
        self.platform = campaign_data.get('platform', 'unknown')
        self.campaign_data = campaign_data
        self.posts = campaign_data.get('posts', [])
        self.total_spend = campaign_data.get('total_spend', 0)
        self.metrics = {}

    def safe_divide(self, numerator: float, denominator: float, default: float = 0.0) -> float:
        """Safely divide two numbers, returning default if denominator is zero."""
        if denominator == 0:
            return default
        return numerator / denominator

    def calculate_engagement_rate(self, post: Dict[str, Any]) -> float:
        """
        Calculate engagement rate for a post.

        Args:
            post: Dictionary with likes, comments, shares, and reach

        Returns:
            Engagement rate as percentage
        """
        likes = post.get('likes', 0)
        comments = post.get('comments', 0)
        shares = post.get('shares', 0)
        saves = post.get('saves', 0)
        reach = post.get('reach', 0)

        total_engagements = likes + comments + shares + saves
        engagement_rate = self.safe_divide(total_engagements, reach) * 100

        return round(engagement_rate, 2)

    def calculate_ctr(self, clicks: int, impressions: int) -> float:
        """
        Calculate click-through rate.

        Args:
            clicks: Number of clicks
            impressions: Number of impressions

        Returns:
            CTR as percentage
        """
        ctr = self.safe_divide(clicks, impressions) * 100
        return round(ctr, 2)

    def calculate_campaign_metrics(self) -> Dict[str, Any]:
        """Calculate overall campaign metrics."""
        total_likes = sum(post.get('likes', 0) for post in self.posts)
        total_comments = sum(post.get('comments', 0) for post in self.posts)
        total_shares = sum(post.get('shares', 0) for post in self.posts)
        total_saves = sum(post.get('saves', 0) for post in self.posts)
        total_reach = sum(post.get('reach', 0) for post in self.posts)
        total_impressions = sum(post.get('impressions', 0) for post in self.posts)
        total_clicks = sum(post.get('clicks', 0) for post in self.posts)

        total_engagements = total_likes + total_comments + total_shares + total_saves

        return {
            'platform': self.platform,
            'total_posts': len(self.posts),
            'total_engagements': total_engagements,
            'total_reach': total_reach,
            'total_impressions': total_impressions,
            'total_clicks': total_clicks,
            'avg_engagement_rate': self.safe_divide(total_engagements, total_reach) * 100,
            'ctr': self.calculate_ctr(total_clicks, total_impressions)
        }

    def calculate_roi_metrics(self) -> Dict[str, Any]:
        """Calculate engagement costs and financial ROI only from attributed revenue."""
        campaign_metrics = self.calculate_campaign_metrics()

        total_engagements = campaign_metrics['total_engagements']
        total_clicks = campaign_metrics['total_clicks']

        cost_per_engagement = self.safe_divide(self.total_spend, total_engagements)
        cost_per_click = self.safe_divide(self.total_spend, total_clicks)

        raw_revenue = self.campaign_data.get('attributed_revenue')
        try:
            attributed_revenue = float(raw_revenue) if raw_revenue is not None else None
        except (TypeError, ValueError):
            attributed_revenue = None
        if attributed_revenue is not None and attributed_revenue < 0:
            attributed_revenue = None
        financial_roi = None
        roas = None
        attribution_method = self.campaign_data.get('attribution_method')
        attribution_window = self.campaign_data.get('attribution_window')
        has_attribution_basis = bool(attribution_method and attribution_window)
        if attributed_revenue is not None and self.total_spend > 0 and has_attribution_basis:
            financial_roi = self.safe_divide(attributed_revenue - self.total_spend, self.total_spend) * 100
            roas = self.safe_divide(attributed_revenue, self.total_spend)

        return {
            'total_spend': round(self.total_spend, 2),
            'cost_per_engagement': round(cost_per_engagement, 2),
            'cost_per_click': round(cost_per_click, 2),
            'attributed_revenue': round(attributed_revenue, 2) if attributed_revenue is not None else None,
            'roas': round(roas, 2) if roas is not None else None,
            'financial_roi_percentage': round(financial_roi, 2) if financial_roi is not None else None,
            'roi_basis': {
                'method': attribution_method,
                'window': attribution_window
            } if financial_roi is not None else None
        }

    def identify_top_posts(self, metric: str = 'engagement_rate', limit: int = 5) -> List[Dict[str, Any]]:
        """
        Identify top performing posts.

        Args:
            metric: Metric to sort by (engagement_rate, likes, shares, etc.)
            limit: Number of top posts to return

        Returns:
            List of top performing posts with metrics
        """
        posts_with_metrics = []

        for post in self.posts:
            post_copy = post.copy()
            post_copy['engagement_rate'] = self.calculate_engagement_rate(post)
            posts_with_metrics.append(post_copy)

        # Sort by specified metric
        if metric == 'engagement_rate':
            sorted_posts = sorted(posts_with_metrics,
                                key=lambda x: x['engagement_rate'],
                                reverse=True)
        else:
            sorted_posts = sorted(posts_with_metrics,
                                key=lambda x: x.get(metric, 0),
                                reverse=True)

        return sorted_posts[:limit]

    def analyze_all(self) -> Dict[str, Any]:
        """Run complete analysis."""
        return {
            'campaign_metrics': self.calculate_campaign_metrics(),
            'roi_metrics': self.calculate_roi_metrics(),
            'top_posts': self.identify_top_posts()
        }
