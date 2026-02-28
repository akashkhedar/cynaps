# Cynaps API Documentation

> Last Updated: February 18, 2026

Welcome to the Cynaps API documentation. This guide is designed for **enterprise clients** who want to integrate Cynaps's data annotation capabilities directly into their ML pipelines.

## Quick Links

| Document | Description |
|----------|-------------|
| [Getting Started](./getting-started.md) | Installation, authentication, and your first project |
| [Python SDK Reference](./sdk-reference.md) | Complete SDK documentation with async support |
| [REST API Reference](./rest-api.md) | Direct HTTP API endpoints |
| [Annotation Types](./annotation-types.md) | Supported annotation formats & output schemas |
| [Webhooks](./webhooks.md) | Real-time event notifications |
| [Configuration](./configuration.md) | Advanced settings & customization |
| [Complete Workflow Examples](./examples/complete-workflow.md) | End-to-end ML pipeline examples |

## What is Cynaps?

Cynaps is an enterprise-grade data annotation platform that provides:

- **High-quality annotations** from trained, verified annotators with accuracy scoring
- **Multiple annotation types** (classification, bounding boxes, segmentation, NER, transcription, etc.)
- **Quality assurance** through Honeypot v2.0, multi-annotator consensus, and expert review
- **Seamless integration** with your existing ML pipelines via SDK and REST API
- **Flexible billing** with pay-as-you-go credits or subscription plans (Starter/Growth/Scale)

## Integration Overview

```python
from cynaps_sdk import Cynaps

# Initialize client
client = Cynaps(api_key="sk_live_xxxx")

# Create project → Upload data → Wait for completion → Download results
project = client.projects.create(name="My Project", annotation_type="classification")
project.upload_data([{"image": "s3://bucket/img1.jpg"}, ...])

# Monitor progress
while project.progress < 100:
    time.sleep(3600)

# Download annotations
annotations = project.export(format="coco")
```

## Support

- **Email**: api-support@cynaps.io
- **Documentation Issues**: [GitHub Issues](https://github.com/cynaps/docs/issues)
- **Enterprise Support**: Contact your account manager
