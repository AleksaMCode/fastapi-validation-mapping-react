import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

type BackendErrorResponse = {
  errors?: Record<string, string>;
};

const API_BASE_URL = 'http://127.0.0.1:8000';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string(),
  company_id: z.string(),
  type: z.enum(['admin', 'user']),
  startdate: z.string().min(1, 'Start date is required'),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  name: '',
  email: '',
  company_id: '',
  type: 'user',
  startdate: '',
};

export default function NewUserForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    control,
    register,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const onSubmit = async (values: FormValues) => {
    setStatus('idle');
    clearErrors();

    try {
      const response = await fetch(`${API_BASE_URL}/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.status === 422) {
        const data = (await response.json()) as BackendErrorResponse;
        const backendErrors = data.errors ?? {};

        for (const [path, message] of Object.entries(backendErrors)) {
          const field = path as keyof FormValues;
          if (field in defaultValues) {
            setError(field, { type: 'server', message });
          }
        }
        return;
      }

      if (!response.ok) {
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const nameField = register('name');
  const emailField = register('email');
  const companyIdField = register('company_id');
  const startDateField = register('startdate');

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card elevation={3}>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Create New User
              </Typography>
            </Box>

            {status === 'error' ? (
              <Alert severity="error">
                Could not submit form. Please verify backend is running and try
                again.
              </Alert>
            ) : null}
            {status === 'success' ? (
              <Alert severity="success">Submitted successfully.</Alert>
            ) : null}

            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  {...nameField}
                  onChange={(event) => {
                    setStatus('idle');
                    clearErrors('name');
                    nameField.onChange(event);
                  }}
                  error={Boolean(errors.name?.message)}
                  helperText={errors.name?.message ?? ' '}
                  fullWidth
                />

                <TextField
                  label="Email"
                  type="email"
                  {...emailField}
                  onChange={(event) => {
                    setStatus('idle');
                    clearErrors('email');
                    emailField.onChange(event);
                  }}
                  error={Boolean(errors.email?.message)}
                  helperText={errors.email?.message ?? ' '}
                  fullWidth
                />

                <TextField
                  label="Company ID"
                  {...companyIdField}
                  onChange={(event) => {
                    setStatus('idle');
                    clearErrors('company_id');
                    companyIdField.onChange(event);
                  }}
                  error={Boolean(errors.company_id?.message)}
                  helperText={errors.company_id?.message ?? ' '}
                  fullWidth
                />

                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Type"
                      value={field.value}
                      onChange={(event) => {
                        setStatus('idle');
                        clearErrors('type');
                        field.onChange(event.target.value);
                      }}
                      error={Boolean(errors.type?.message)}
                      helperText={errors.type?.message ?? ' '}
                      fullWidth
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                  )}
                />

                <TextField
                  label="Start Date"
                  type="date"
                  {...startDateField}
                  onChange={(event) => {
                    setStatus('idle');
                    clearErrors('startdate');
                    startDateField.onChange(event);
                  }}
                  error={Boolean(errors.startdate?.message)}
                  helperText={errors.startdate?.message ?? ' '}
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !isDirty}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
