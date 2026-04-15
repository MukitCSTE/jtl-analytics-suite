import { useCallback, useState } from 'react';
import IErpPageProps from './IErpPageProps';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Text,
  Badge,
  Stack,
  Separator,
  Box,
  Button,
} from '@jtl-software/platform-ui-react';
import { Globe, Link as LinkIcon, Database, Key } from 'lucide-react';
import { apiUrl } from '../../common/constants';

const manifestMappings = [{ icon: LinkIcon, field: 'capabilities.erp.menuItems[].url', description: 'Sidebar menu entry' }];

const ErpPage: React.FC<IErpPageProps> = ({ appBridge }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isGettingTenant, setIsGettingTenant] = useState(false);

  const handleGetTenantId = useCallback(async (): Promise<void> => {
    try {
      setIsGettingTenant(true);
      const sessionToken = await appBridge.method.call<string>('getSessionToken');
      const response = await fetch(`${apiUrl}/get-tenant-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken,
        },
      });
      const data = await response.json();
      setTenantId(data.tenantId || data.error);
    } catch (err) {
      setTenantId('Error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGettingTenant(false);
    }
  }, [appBridge]);

  const handleRequestTimestamp = useCallback(async (): Promise<void> => {
    try {
      setIsRequesting(true);
      appBridge.method.expose('getCurrentTime', () => new Date());
      const result = await appBridge.method.call<Date>('getCurrentTime');
      setTime(result.toUTCString());
    } finally {
      setIsRequesting(false);
    }
  }, [appBridge]);

  return (
    <Box className="flex justify-center p-12">
      <Card className="max-w-[520px] w-full">
        <CardHeader className="items-center">
          <Globe size={40} color="#1a56db" strokeWidth={1.5} />
          <CardTitle>ERP Integration</CardTitle>
          <CardDescription className="text-center">
            This is the main app view. It loads when the user clicks your app's menu entry in the ERP sidebar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stack spacing="5" direction="column">
            <Stack spacing="3" direction="column">
              <Text type="xs" weight="semibold" color="muted">
                MANIFEST MAPPING
              </Text>
              {manifestMappings.map(mapping => (
                <Stack key={mapping.field} spacing="3" direction="row" itemAlign="start">
                  <mapping.icon size={16} color="#1a56db" className="shrink-0 mt-0.5" />
                  <Stack spacing="0" direction="column">
                    <Text type="inline-code">{mapping.field}</Text>
                    <Text type="xs" color="muted">
                      → {mapping.description}
                    </Text>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            <Separator />

            <Stack spacing="3" direction="column">
              <Stack spacing="2" direction="row" itemAlign="center">
                <Text type="small" weight="semibold">
                  DEMO: AppBridge Methods
                </Text>
                <Badge variant="default" label="Ready" />
              </Stack>
              <Text type="xs" color="muted">
                The AppBridge lets you expose and call methods between your app and the platform.
              </Text>
              <Button onClick={handleRequestTimestamp} label={isRequesting ? 'Requesting...' : 'Request Current Time'} />
              <Box className="w-full p-4 border border-dashed border-[var(--base-border)] rounded-lg flex items-center justify-center">
                <Text type="small" color="muted">
                  {time ?? 'Click the button to test'}
                </Text>
              </Box>
              <Text type="xs" color="muted" align="center">
                <Text type="inline-code">{"appBridge.method.call('getCurrentTime')"}</Text>
              </Text>
            </Stack>

            <Separator />

            <Stack spacing="3" direction="column">
              <Stack spacing="2" direction="row" itemAlign="center">
                <Key size={16} color="#1a56db" />
                <Text type="small" weight="semibold">
                  Get Tenant ID
                </Text>
              </Stack>
              <Text type="xs" color="muted">
                Extract your tenant ID for testing GraphQL queries via curl.
              </Text>
              <Button onClick={handleGetTenantId} label={isGettingTenant ? 'Getting...' : 'Get Tenant ID'} />
              <Box className="w-full p-4 border border-dashed border-[var(--base-border)] rounded-lg flex items-center justify-center">
                <Text type="small" color="muted">
                  {tenantId ?? 'Click the button to get your tenant ID'}
                </Text>
              </Box>
            </Stack>

            <Separator />

            <Stack spacing="3" direction="column">
              <Stack spacing="2" direction="row" itemAlign="center">
                <Database size={16} color="#1a56db" />
                <Text type="small" weight="semibold">
                  GraphQL API Demo
                </Text>
              </Stack>
              <Text type="xs" color="muted">
                Query real ERP data using the GraphQL API proxy.
              </Text>
              <Button onClick={() => window.location.href = '/graphql-demo'} label="Open GraphQL Demo" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErpPage;
