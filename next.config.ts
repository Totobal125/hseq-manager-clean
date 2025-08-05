const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/inspeccion',
        destination: '/presentation/inspeccion',
      },
      {
        source: '/desempeno',
        destination: '/presentation/desempeno',
      },
      {
        source: '/observacion',
        destination: '/presentation/observacion',
      },
      {
        source: '/incidente',
        destination: '/presentation/incidente',
      },
      {
        source: '/login',
        destination: '/presentation/login',
      },
      {
        source: '/perfil',
        destination: '/presentation/perfil',
      },
      {
        source: '/tipos-empresas',
        destination: '/presentation/tipos-empresas',
      },
      {
        source: '/empresas',
        destination: '/presentation/empresas',
      },
      {
        source: '/usuarios',
        destination: '/presentation/usuarios',
      },
      {
        source: '/cargos',
        destination: '/presentation/cargos',
      },
      {
        source: '/trabajadores',
        destination: '/presentation/trabajadores',
      },
      {
        source: '/actividades',
        destination: '/presentation/actividades',
      },
      {
        source: '/encargados',
        destination: '/presentation/encargados',
      },
      {
        source: '/centros-trabajo',
        destination: '/presentation/centros-trabajo',
      },
      {
        source: '/areas',
        destination: '/presentation/areas',
      },
      {
        source: '/documentacion',
        destination: '/presentation/documentacion',
      },
      {
        source: '/checklist',
        destination: '/presentation/checklist',
      },
      {
        source: '/epp',
        destination: '/presentation/epp',
      },
      {
        source: '/entrega-epp',
        destination: '/presentation/entrega-epp',
      },
      {
        source: '/capacitacion',
        destination: '/presentation/capacitacion',
      },
      {
        source: '/informes',
        destination: '/presentation/informes',
      },
      {
        source: '/rendimiento',
        destination: '/presentation/rendimiento',
      },
      {
        source: '/percepcion-riesgo',
        destination: '/presentation/percepcion-riesgo',
      },
      {
        source: '/observaciones',
        destination: '/presentation/observaciones',
      },
      {
        source: '/causas-basicas',
        destination: '/presentation/personalizar/causas-basicas',
      },
      {
        source: '/acciones-subestandares',
        destination: '/presentation/personalizar/acciones-subestandares',
      },
      {
        source: '/condiciones-subestandares',
        destination: '/presentation/personalizar/condiciones-subestandares',
      },
      {
        source: '/falta-control',
        destination: '/presentation/personalizar/falta-control',
      },
    ];
  },
};

module.exports = nextConfig;
