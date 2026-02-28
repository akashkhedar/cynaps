from .base_client import CynapsBase, AsyncCynapsBase
from .tasks.client_ext import TasksClientExt, AsyncTasksClientExt
from .projects.client_ext import ProjectsClientExt, AsyncProjectsClientExt
from .billing.client_ext import BillingClientExt, AsyncBillingClientExt
from .import_storage.client_ext import ImportStorageClientExt, AsyncImportStorageClientExt
from .core.api_error import ApiError


class Cynaps(CynapsBase):
    """"""
    __doc__ += CynapsBase.__doc__

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.tasks = TasksClientExt(client_wrapper=self._client_wrapper)
        self.projects = ProjectsClientExt(client_wrapper=self._client_wrapper)
        self.billing = BillingClientExt(client_wrapper=self._client_wrapper)
        self.import_storage = ImportStorageClientExt(client_wrapper=self._client_wrapper)


class AsyncCynaps(AsyncCynapsBase):
    """"""
    __doc__ += AsyncCynapsBase.__doc__

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.tasks = AsyncTasksClientExt(client_wrapper=self._client_wrapper)
        self.projects = AsyncProjectsClientExt(client_wrapper=self._client_wrapper)
        self.billing = AsyncBillingClientExt(client_wrapper=self._client_wrapper)
        self.import_storage = AsyncImportStorageClientExt(client_wrapper=self._client_wrapper)







