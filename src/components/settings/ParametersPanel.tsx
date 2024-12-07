import React from 'react';
import { Settings2 } from 'lucide-react';

interface ParametersPanelProps {
  temperature: number;
  topP: number;
  onParametersChange: (params: { temperature: number; topP: number }) => void;
}

export default function ParametersPanel({ 
  temperature, 
  topP, 
  onParametersChange 
}: ParametersPanelProps) {
  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-zinc-800 rounded-lg">
          <Settings2 className="w-5 h-5 text-purple-500" />
        </div>
        <h3 className="text-lg font-medium text-white">Generation Parameters</h3>
      </div>

      <div className="space-y-6">
        {/* Temperature Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">
              Temperature
            </label>
            <span className="text-sm text-zinc-500">
              {temperature.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => onParametersChange({ 
              temperature: parseFloat(e.target.value), 
              topP 
            })}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-purple-500
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <p className="text-xs text-zinc-500">
            Higher values make output more random, lower values more focused
          </p>
        </div>

        {/* Top P Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">
              Top P
            </label>
            <span className="text-sm text-zinc-500">
              {topP.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={topP}
            onChange={(e) => onParametersChange({ 
              temperature, 
              topP: parseFloat(e.target.value) 
            })}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-purple-500
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <p className="text-xs text-zinc-500">
            Alternative to temperature, controls diversity via nucleus sampling
          </p>
        </div>
      </div>
    </div>
  );
}