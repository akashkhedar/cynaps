from core.utils.exceptions import CynapsAPIException
from rest_framework import status


class LabelBulkUpdateError(CynapsAPIException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY





