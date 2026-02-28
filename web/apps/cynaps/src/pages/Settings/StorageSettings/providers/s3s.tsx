import { EnterpriseBadge, IconSpark } from "@cynaps/ui";
import { Alert, AlertTitle, AlertDescription } from "@cynaps/shad/components/ui/alert";
import { IconCloudProviderS3 } from "@cynaps/icons";
import type { ProviderConfig } from "@cynaps/app-common/blocks/StorageProviderForm/types/provider";

const s3sProvider: ProviderConfig = {
  name: "s3s",
  title: "Amazon S3\nwith IAM Role",
  description: "Configure your AWS S3 connection using IAM role access for enhanced security (proxy only)",
  icon: IconCloudProviderS3,
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
            Amazon S3 with IAM Role is available in Cynaps Enterprise.{" "}
            <a
              href="https://docs.Cynaps.com/guide/storage.html#Set-up-an-S3-connection-with-IAM-role-access"
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

export default s3sProvider;

