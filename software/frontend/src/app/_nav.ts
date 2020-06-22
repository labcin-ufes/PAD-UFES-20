// Navegação do 'SUPER'
export const navItemsSuper = [
  {
    name: 'Home',
    url: '/dashboard',
    icon: 'icon-home',
    badge: {
      variant: 'info'
    }
  },
  {
    title: true,
    name: 'PAD'
  },
  {
    name: 'Paciente Cirurgia',
    url: 'paciente-cirurgia',
    icon: 'fa fa-address-card',
    children: [
      {
        name: 'Novo paciente',
        url: 'paciente-cirurgia/novo-paciente',
        icon: 'fa fa-user-plus'
      },
      {
        name: 'Nova lesão',
        url: 'paciente-cirurgia/nova-lesao',
        icon: 'fa fa-medkit'
      },
      {
        name: 'Novo histopatológico',
        url: 'paciente-cirurgia/novo-histopatologico',
        icon: 'fa fa-file-text-o'
      },
      {
        name: 'Editar paciente',
        url: 'paciente-cirurgia/editar-paciente',
        icon: 'fa fa-pencil-square-o'
      },
      {
        name: 'Filtrar pacientes',
        url: 'paciente-cirurgia/filtrar-pacientes',
        icon: 'fa fa-filter'
      },
      {
        name: 'Visualizar paciente',
        url: 'paciente-cirurgia/visualizar-paciente',
        icon: 'icon-eyeglass'
      }
    ]
  },
  {
    name: 'Painel de lesões',
    url: 'visualizar-lesoes',
    icon: 'fa fa-th-large'
  },
  {
    name: 'Análise de dados',
    url: 'analise-dados',
    icon: 'fa fa-area-chart'
  },
  {
    name: 'Usuário',
    url: 'usuario',
    icon: 'fa fa-user-md',
    children: [
      {
        name: 'Novo usuário',
        url: 'usuario/novo',
        icon: 'fa fa-user-plus'
      },
      {
        name: 'Alterar meus dados',
        url: 'usuario/editar',
        icon: 'fa fa-pencil-square-o'
      },
      {
        name: 'Gerenciar usuários',
        url: 'usuario/gerenciar',
        icon: 'fa fa-wrench'
      }
    ]
  },
  {
    title: true,
    name: 'Uso interno',
  },
  {
    name: 'Paciente Dermato',
    url: 'dermato',
    icon: 'fa fa-address-card-o',
    children: [
      {
        name: 'Novo paciente',
        url: 'dermato/novo-paciente',
        icon: 'fa fa-user-plus',
      },
      {
        name: 'Nova lesão',
        url: 'dermato/nova-lesao',
        icon: 'fa fa-medkit'
      },
      {
        name: 'Visualizar paciente',
        url: 'dermato/visualizar-paciente',
        icon: 'icon-eyeglass'
      },
      {
        name: 'Estatísticas',
        url: 'dermato/estatisticas',
        icon: 'fa fa-pie-chart'
      },
      {
        name: 'Painel de lesões',
        url: 'dermato/painel-lesoes',
        icon: 'fa fa-th-large'
      }
    ]
  },
  {
    name: 'Auditoria',
    url: 'auditoria',
    icon: 'icon-note',
    children: [
      {
        name: 'Paciente cirurgia',
        url: 'auditoria/paciente-cirurgia',
        icon: 'icon-note'
      },
      {
        name: 'Paciente dermato',
        url: 'auditoria/paciente-dermato',
        icon: 'icon-note'
      }
    ]
  },
  {
    name: 'Extra',
    url: 'extra',
    icon: 'icon-grid',
    children: [
      {
        name: 'Sincronizar dados',
        url: 'extra/sincronizar-dados',
        icon: 'icon-shuffle'
      },
      {
        name: 'Gerar dataset',
        url: 'extra/gerar-dataset',
        icon: 'icon-doc'
      },
      {
        name: 'Segmentar imagens',
        url: 'extra/segmentar-imagens',
        icon: 'fa fa-scissors'
      },
      {
        name: 'Backup sistema',
        url: 'extra/backup-sistema',
        icon: 'icon-disc'
      },
      {
        name: 'Atualizar sistema',
        url: 'extra/atualizar-sistema',
        icon: 'fa fa-upload'
      },
      {
        name: 'Configurações',
        url: 'extra/configuracoes',
        icon: 'fa fa-cogs'
      }
    ]
  }
];

// Navegação do 'ADMIN'
export const navItemsAdmin = [
  {
    name: 'Home',
    url: '/dashboard',
    icon: 'icon-home',
    badge: {
      variant: 'info'
    }
  },
  {
    title: true,
    name: 'PAD'
  },
  {
    name: 'Paciente Cirurgia',
    url: 'paciente-cirurgia',
    icon: 'fa fa-address-card',
    children: [
      {
        name: 'Novo paciente',
        url: 'paciente-cirurgia/novo-paciente',
        icon: 'fa fa-user-plus'
      },
      {
        name: 'Nova lesão',
        url: 'paciente-cirurgia/nova-lesao',
        icon: 'fa fa-medkit'
      },
      {
        name: 'Novo histopatológico',
        url: 'paciente-cirurgia/novo-histopatologico',
        icon: 'fa fa-file-text-o'
      },
      {
        name: 'Editar paciente',
        url: 'paciente-cirurgia/editar-paciente',
        icon: 'fa fa-pencil-square-o'
      },
      {
        name: 'Filtrar pacientes',
        url: 'paciente-cirurgia/filtrar-pacientes',
        icon: 'fa fa-filter'
      },
      {
        name: 'Visualizar paciente',
        url: 'paciente-cirurgia/visualizar-paciente',
        icon: 'icon-eyeglass'
      }
    ]
  },
  {
    name: 'Painel de lesões',
    url: 'visualizar-lesoes',
    icon: 'fa fa-th-large'
  },
  {
    name: 'Análise de dados',
    url: 'analise-dados',
    icon: 'fa fa-area-chart'
  },
  {
    name: 'Usuário',
    url: 'usuario',
    icon: 'fa fa-user-md',
    children: [
      {
        name: 'Novo usuário',
        url: 'usuario/novo',
        icon: 'fa fa-user-plus'
      },
      {
        name: 'Alterar meus dados',
        url: 'usuario/editar',
        icon: 'fa fa-pencil-square-o'
      },
      {
        name: 'Gerenciar usuários',
        url: 'usuario/gerenciar',
        icon: 'fa fa-wrench'
      }
    ]
  }
];

// Navegação do 'USER'
export const navItemsUser = [
  {
    name: 'Home',
    url: '/dashboard',
    icon: 'icon-home',
    badge: {
      variant: 'info'
    }
  },
  {
    title: true,
    name: 'PAD'
  },
  {
    name: 'Paciente Cirurgia',
    url: 'paciente-cirurgia',
    icon: 'fa fa-address-card',
    children: [
      {
        name: 'Novo paciente',
        url: 'paciente-cirurgia/novo-paciente',
        icon: 'fa fa-user-plus'
      },
      {
        name: 'Nova lesão',
        url: 'paciente-cirurgia/nova-lesao',
        icon: 'fa fa-medkit'
      },
      {
        name: 'Novo histopatológico',
        url: 'paciente-cirurgia/novo-histopatologico',
        icon: 'fa fa-file-text-o'
      },
      {
        name: 'Filtrar pacientes',
        url: 'paciente-cirurgia/filtrar-pacientes',
        icon: 'fa fa-filter'
      },
      {
        name: 'Visualizar paciente',
        url: 'paciente-cirurgia/visualizar-paciente',
        icon: 'icon-eyeglass'
      }
    ]
  },
  {
    name: 'Painel de lesões',
    url: 'visualizar-lesoes',
    icon: 'fa fa-th-large'
  },
  {
    name: 'Análise de dados',
    url: 'analise-dados',
    icon: 'fa fa-area-chart'
  },
  {
    name: 'Usuário',
    url: 'usuario',
    icon: 'fa fa-user-md',
    children: [
      {
        name: 'Alterar meus dados',
        url: 'usuario/editar',
        icon: 'fa fa-pencil-square-o'
      }
    ]
  }
];
