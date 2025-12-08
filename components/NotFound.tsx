import React from 'react';
import { Button } from './ui-components';
import { TriangleAlert, ArrowRight } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border-2 border-slate-100 border-dashed">
        <TriangleAlert className="w-12 h-12 text-slate-300" />
      </div>
      
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 font-mono tracking-tighter mb-4">
        404
      </h1>
      
      <h2 className="text-2xl font-bold mb-4">Объект не найден</h2>
      
      <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
        Запрашиваемая страница отсутствует в проектной документации или была демонтирована.
      </p>

      <Button 
        className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800"
        onClick={() => window.location.href = '/'}
      >
        Вернуться на главную <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
      
      <div className="mt-12 p-4 bg-slate-50 rounded text-xs font-mono text-slate-400">
        Error Code: PAGE_NOT_FOUND_EXCEPTION
      </div>
    </div>
  );
};