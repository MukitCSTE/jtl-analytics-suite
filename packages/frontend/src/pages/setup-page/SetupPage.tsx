import { useCallback, useState } from 'react';
import ISetupPageProps from './ISetupPageProps';
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
import { Settings } from 'lucide-react';
import { apiUrl } from '../../common/constants';

const howItWorks = [
  { step: '1', text: 'The platform loads this page via ', code: 'lifecycle.setupUrl', suffix: ' in your manifest' },
  { step: '2', text: 'Your app requests a session token via ', code: "appBridge.method.call('getSessionToken')", suffix: '' },
  { step: '3', text: 'Call ', code: "appBridge.method.call('setupCompleted')", suffix: ' to finish installation' },
];

const SetupPage: React.FC<ISetupPageProps> = ({ appBridge }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetupCompleted = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const sessionToken = await appBridge.method.call('getSessionToken');
      const response = await fetch(`${apiUrl}/connect-tenant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken }),
      });

      const responseBody = await response.text();
      console.log('Response from backend:', response.status, responseBody);

      if (response.ok) {
        await appBridge.method.call('setupCompleted');
        setIsComplete(true);
      } else {
        setError(`Backend returned ${response.status}`);
      }
    } catch (err) {
      console.error('An error occurred during setup:', err);
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }, [appBridge]);

  return (
    <Box className="flex justify-center p-12">
      <Card className="max-w-[520px] w-full">
        <CardHeader className="items-center">
          <Settings size={40} color="#1a56db" strokeWidth={1.5} />
          <CardTitle>App Setup</CardTitle>
          <CardDescription className="text-center">
            This page is shown during app installation. Complete the setup to connect your app to the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stack spacing="5" direction="column">
            <Stack spacing="3" direction="column">
              <Text type="xs" weight="semibold" color="muted">
                HOW IT WORKS
              </Text>
              {howItWorks.map(item => (
                <Stack key={item.step} spacing="3" direction="row" itemAlign="start">
                  <Badge variant="outline" label={item.step} />
                  <Text type="small" color="muted">
                    {item.text}
                    <Text type="inline-code">{item.code}</Text>
                    {item.suffix}
                  </Text>
                </Stack>
              ))}
            </Stack>

            <Separator />

            <Stack spacing="3" direction="column">
              <Text type="xs" weight="semibold" color="muted">
                TRY IT
              </Text>
              <Button onClick={handleSetupCompleted} label={isLoading ? 'Setting up...' : 'Complete Setup'} />
              {isComplete && (
                <Text type="small" color="success">
                  Setup completed successfully.
                </Text>
              )}
              {error && (
                <Text type="small" color="danger">
                  {error}
                </Text>
              )}
              <Text type="xs" color="muted" align="center">
                This will call your backend and signal setup completion to the platform.
              </Text>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SetupPage;
