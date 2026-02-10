/**
 * Módulo de Facturación (Solo SUPERADMIN y ADMIN)
 */

'use client';

import { Box, Typography, Paper, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaidIcon from '@mui/icons-material/Paid';
import PendingIcon from '@mui/icons-material/Pending';

export default function BillingModule() {
  const summary = [
    { label: 'Ingresos del Mes', value: '$124,500', color: '#2e7d32' },
    { label: 'Pagos Pendientes', value: '$12,300', color: '#ed6c02' },
    { label: 'Total Facturado', value: '$498,750', color: '#1976d2' },
  ];

  const recentTransactions = [
    { id: '1', patient: 'María García', concept: 'Consulta Cardiología', amount: 1500, status: 'Pagado', date: '2026-02-10' },
    { id: '2', patient: 'Carlos López', concept: 'Estudio Laboratorio', amount: 850, status: 'Pendiente', date: '2026-02-09' },
    { id: '3', patient: 'Luis Hernández', concept: 'Consulta General', amount: 800, status: 'Pagado', date: '2026-02-08' },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        <AttachMoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Gestión de Facturación
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Administra los ingresos y pagos del sistema
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {summary.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.label}
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: item.color }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transacciones Recientes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Paciente</TableCell>
                    <TableCell>Concepto</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{transaction.patient}</TableCell>
                      <TableCell>{transaction.concept}</TableCell>
                      <TableCell>${transaction.amount} MXN</TableCell>
                      <TableCell>
                        {transaction.status === 'Pagado' ? (
                          <PaidIcon color="success" />
                        ) : (
                          <PendingIcon color="warning" />
                        )}
                        {' '}{transaction.status}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString('es-MX')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
