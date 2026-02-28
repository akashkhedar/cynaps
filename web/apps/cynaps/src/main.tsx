// Initialize APP_SETTINGS first (must be before any other imports that use it)
import "./config/AppSettingsInit";

import { registerAnalytics } from "@cynaps/core";
registerAnalytics();

import "./app/App";
import "./utils/service-worker";
import "./utils/state-registry-lso";

