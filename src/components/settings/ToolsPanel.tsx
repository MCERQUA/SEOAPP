import React from 'react';
import { Code, Search, Wrench } from 'lucide-react';
import { Switch } from '../ui/switch';

interface ToolsPanelProps {
  tools: Array<{ type: string }>;
  onToolsChange: (tools: Array<{ type: string }>) => void;
}

const AVAILABLE_TOOLS = [
  { 
    type: 'code_interpreter',
    icon: Code,
    name: 'Code Interpreter',
    description: 'Execute code and analyze data',
    required: true
  },
  {
    type: 'file_search',
    icon: Search,
    name: 'File Search',
    description: 'Search and retrieve content from files',
    required: true
  },
  {
    type: 'function',
    icon: Wrench,
    name: 'Function Calling',
    description: 'Call external functions and APIs',
    required: false
  }
];

export default function ToolsPanel({ tools, onToolsChange }: ToolsPanelProps) {
  const isToolEnabled = (type: string) => 
    tools.some(tool => tool.type === type);

  const toggleTool = (type: string) => {
    if (isToolEnabled(type)) {
      onToolsChange(tools.filter(tool => tool.type !== type));
    } else {
      onToolsChange([...tools, { type }]);
    }
  };

  return (
    <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
      <h3 className="text-lg font-medium text-white mb-4">Assistant Tools</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-400">
            Code Interpreter and File Search must be enabled for the assistant to process files and generate content effectively.
          </p>
        </div>

        <div className="space-y-3">
          {AVAILABLE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const enabled = isToolEnabled(tool.type);
            
            return (
              <div
                key={tool.type}
                className={`p-4 rounded-lg border transition-all
                  ${enabled 
                    ? 'bg-emerald-500/10 border-emerald-500/50' 
                    : 'bg-zinc-800 border-zinc-700'}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-zinc-800 rounded-lg">
                      <Icon className={`w-5 h-5 ${enabled ? 'text-emerald-500' : 'text-zinc-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{tool.name}</span>
                        {tool.required && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full 
                            bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">{tool.description}</p>
                    </div>
                  </div>
                  
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => toggleTool(tool.type)}
                    disabled={tool.required && enabled}
                    className={tool.required ? 'cursor-not-allowed' : ''}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}