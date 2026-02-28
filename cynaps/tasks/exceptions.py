from core.utils.exceptions import CynapsAPIException
from rest_framework import status


class AnnotationDuplicateError(CynapsAPIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'Annotation with this unique id already exists'





