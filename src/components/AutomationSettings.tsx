import { Switch } from "./ui/switch";

export interface AutomationSettingsProps {
  automationEnabled: boolean;
  setAutomationEnabled: (enabled: boolean) => void;
  solFees?: number;
  prepaidTxFees?: number;
}

export const AutomationSettings = ({
  automationEnabled,
  setAutomationEnabled,
  solFees = 0,
  prepaidTxFees = 0,
}: AutomationSettingsProps) => {
  return (
    <div className="bg-slate-850 rounded-lg p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm">Enable Automation</span>
          <span className="text-xs text-muted-foreground">
            Enable automatic claiming of rewards
          </span>
        </div>
        <Switch
          checked={automationEnabled}
          onCheckedChange={setAutomationEnabled}
        />
      </div>
      <div className="flex flex-row justify-between items-center mt-4 mb-2">
        <span className="text-sm text-muted-foreground">Rent Fees</span>
        <span className="text-sm">{solFees.toFixed(6)} SOL</span>
      </div>
      <div className="flex flex-row justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Prepaid Transaction Fees
        </span>
        <span className="text-sm">{prepaidTxFees.toFixed(6)} SOL</span>
      </div>
    </div>
  );
};
