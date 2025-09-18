import { Card, CardContent } from "@/components/ui/card";

import { TODO_MESSAGES } from "../constants";

export const LoadingState = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-muted-foreground">{TODO_MESSAGES.LOADING}</p>
      </CardContent>
    </Card>
  );
};
