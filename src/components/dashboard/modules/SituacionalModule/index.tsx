'use client';

/**
 * SituacionalModule — Módulo de requerimientos situacionales
 * Vista clínica: formulario + mis tickets
 * Vista admin (prop): panel de gestión completo
 */

import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FormularioSituacional from './FormularioSituacional';
import MisRequisiciones from './MisRequisiciones';
import AdminPanel from './AdminPanel';

interface Props {
  adminView?: boolean;
}

export default function SituacionalModule({ adminView = false }: Props) {
  const [tab, setTab] = useState(0);

  if (adminView) {
    return (
      <Box>
        <AdminPanel />
      </Box>
    );
  }

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Tab icon={<AssignmentIcon />} iconPosition="start" label="Nuevo requerimiento" />
        <Tab icon={<ListAltIcon />} iconPosition="start" label="Mis requerimientos" />
      </Tabs>

      {tab === 0 && (
        <FormularioSituacional onSuccess={() => setTab(1)} />
      )}
      {tab === 1 && (
        <MisRequisiciones onNuevoRequerimiento={() => setTab(0)} />
      )}
    </Box>
  );
}
