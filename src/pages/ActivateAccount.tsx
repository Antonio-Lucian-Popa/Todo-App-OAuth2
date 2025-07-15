import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';

export function ActivateAccount() {
    const [params] = useSearchParams();
    const token = params.get('token');

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const hasActivated = useRef(false);

    useEffect(() => {
        if (!token || hasActivated.current) return;
        hasActivated.current = true;

        const activate = async () => {
            try {
                const response = await authService.confirmEmail(token);
                setMessage(response.message || 'Cont activat cu succes!');
            } catch (err: any) {
                setError(err.response?.data?.message || 'Activarea a eșuat.');
            } finally {
                setLoading(false);
            }
        };

        activate();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Activare cont</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center space-x-2 text-gray-500">
                            <Loader className="animate-spin w-5 h-5" />
                            <span>Activare în curs...</span>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-4">
                            <Alert variant="default">
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                            <a
                                href="/login"
                                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                            >
                                Mergi la login
                            </a>
                        </div>
                    )}
                </CardContent>

            </Card>
        </div>
    );
}
