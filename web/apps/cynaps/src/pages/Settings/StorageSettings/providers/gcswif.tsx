import { EnterpriseBadge, IconSpark } from "@cynaps/ui";
import { Alert, AlertTitle, AlertDescription } from "@cynaps/shad/components/ui/alert";
import { IconCloudProviderGCS } from "@cynaps/icons";
import type { ProviderConfig } from "@cynaps/app-common/blocks/StorageProviderForm/types/provider";

const gcsWifProvider: ProviderConfig = {
  name: "gcswif",
  title: "Google Cloud Storage\n(WIF Auth)",
  description:
    "Configure your Google Cloud Storage connection with Workload Identity Federation authentication (proxy only)",
  icon: IconCloudProviderGCS,
  disabled: true,
  badge: <EnterpriseBadge />,
  fields: [
    {
      name: "enterprise_info",
      type: "message",
      content: (
        <Alert variant="gradient">
          <IconSpark />
          <AlertTitle>Enterprise Feature</AlertTitle>
          <AlertDescription>
            Google Cloud Storage with Workload Identity Federation is available in Cynaps Enterprise.{" "}
            <a
              href="https://docs.Cynaps.com/guide/storage.html#Google-Cloud-Storage-with-Workload-Identity-Federation-WIF"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Learn more
            </a>
          </AlertDescription>
        </Alert>
      ),
    },
  ],
  layout: [{ fields: ["enterprise_info"] }],
};

export default gcsWifProvider;

