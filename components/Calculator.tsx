import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Label, Slider, Switch, Button } from './ui-components';
import { formatCurrency } from '../lib/utils';
import { Calculator as CalcIcon, ArrowRight } from 'lucide-react';
import { ContactFormModal } from './ContactFormModal';

export const Calculator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State
  const [area, setArea] = useState<number[]>([45]);
  const [isNewBuild, setIsNewBuild] = useState<boolean>(true); // true = Новостройка, false = Вторичка
  const [hasDesignProject, setHasDesignProject] = useState<boolean>(false);
  const [needsDemolition, setNeedsDemolition] = useState<boolean>(false);

  // Pricing Logic (Mocked based on engineering standards)
  const calculateTotal = useMemo(() => {
    const currentArea = area[0];
    
    // Base Rates per m2
    const baseWorkRate = 18000; 
    const baseMaterialRate = 12000;
    
    let totalWork = baseWorkRate * currentArea;
    let totalMaterial = baseMaterialRate * currentArea;

    // Secondary housing is often more expensive due to complexity
    if (!isNewBuild) {
      totalWork *= 1.15; 
      if (needsDemolition) {
        totalWork += (2500 * currentArea); // Demolition cost
      }
    }

    // Design Project fixed cost or per meter
    const designCost = hasDesignProject ? (2500 * currentArea) : 0;

    return {
      work: Math.round(totalWork),
      materials: Math.round(totalMaterial),
      design: Math.round(designCost),
      total: Math.round(totalWork + totalMaterial + designCost)
    };
  }, [area, isNewBuild, hasDesignProject, needsDemolition]);

  return (
    <Card className="w-full shadow-lg border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-slate-900 rounded-md">
             <CalcIcon className="w-5 h-5 text-white" />
          </div>
          <CardTitle>Калькулятор бюджета</CardTitle>
        </div>
        <p className="text-sm text-slate-500">
          Точный расчет с учетом материалов и работ.
        </p>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        
        {/* Step 1: Area */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <Label className="text-base font-semibold">Площадь квартиры</Label>
             <span className="font-mono text-lg font-bold bg-slate-100 px-2 py-1 rounded">{area[0]} м²</span>
          </div>
          <Slider 
            value={area} 
            onValueChange={setArea} 
            max={150} 
            step={1} 
            className="py-4"
          />
        </div>

        {/* Step 2: Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                <Label htmlFor="housing-type" className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-semibold">Тип жилья</span>
                  <span className="font-normal text-xs text-slate-500">
                    {isNewBuild ? "Новостройка (без отделки)" : "Вторичное жилье"}
                  </span>
                </Label>
                <Switch 
                  checked={!isNewBuild} 
                  onCheckedChange={(c) => {
                    setIsNewBuild(!c);
                    if (!c) setNeedsDemolition(false); // Reset demolition if going back to new build
                  }} 
                />
            </div>

            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                <Label htmlFor="design-project" className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-semibold">Дизайн-проект</span>
                  <span className="font-normal text-xs text-slate-500">
                    {hasDesignProject ? "Разработка включена" : "Есть свой / Не нужен"}
                  </span>
                </Label>
                <Switch checked={hasDesignProject} onCheckedChange={setHasDesignProject} />
            </div>
        </div>

         {/* Conditional Step: Demolition */}
         {!isNewBuild && (
            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg bg-slate-50">
                <Label htmlFor="demolition" className="flex flex-col space-y-1 cursor-pointer">
                  <span className="font-semibold">Требуется демонтаж</span>
                  <span className="font-normal text-xs text-slate-500">
                     Снос перегородок, снятие покрытий
                  </span>
                </Label>
                <Switch checked={needsDemolition} onCheckedChange={setNeedsDemolition} />
            </div>
         )}

        {/* Results */}
        <div className="bg-slate-900 text-slate-50 rounded-lg p-6 mt-6 space-y-4">
            <div className="flex justify-between items-center text-sm opacity-80">
                <span>Стоимость работ:</span>
                <span className="font-mono">{formatCurrency(calculateTotal.work)}</span>
            </div>
            <div className="flex justify-between items-center text-sm opacity-80">
                <span>Черновые материалы:</span>
                <span className="font-mono">{formatCurrency(calculateTotal.materials)}</span>
            </div>
            {hasDesignProject && (
              <div className="flex justify-between items-center text-sm opacity-80">
                  <span>Дизайн-проект:</span>
                  <span className="font-mono">{formatCurrency(calculateTotal.design)}</span>
              </div>
            )}
            <div className="h-px bg-slate-700 my-2"></div>
            <div className="flex justify-between items-end">
                <span className="font-semibold text-lg">Итого:</span>
                <span className="font-mono text-2xl font-bold text-orange-500">{formatCurrency(calculateTotal.total)}</span>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-4 h-12 text-lg"
            >
               Заказать смету <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
                *Расчет является предварительным. Точная стоимость фиксируется после замера.
            </p>
        </div>
      </CardContent>

      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formType="calculator"
        calculatorData={{
          area: area[0],
          isNewBuild,
          hasDesignProject,
          needsDemolition,
          totalWork: calculateTotal.work,
          totalMaterials: calculateTotal.materials,
          totalDesign: calculateTotal.design,
          total: calculateTotal.total
        }}
      />
    </Card>
  );
};