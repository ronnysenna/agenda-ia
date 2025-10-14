'use client';

import { useEffect } from 'react';

export function BootstrapClient() {
    useEffect(() => {
        // Importação do Bootstrap apenas no cliente
        require('bootstrap/dist/css/bootstrap.min.css');
        // Importando também o JavaScript do Bootstrap para garantir funcionamento completo
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return null;
}
