export interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  type: string;
  subject: string;
  location: string;
  priority: string;
  reminder: string;
  repeat: boolean;
}

export interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  onCancel?: () => void;
}
