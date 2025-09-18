import { Card, CardContent } from "@/components/ui/card";

import { TODO_MESSAGES } from "../constants";

export const EmptyState = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-muted-foreground">{TODO_MESSAGES.EMPTY_STATE}</p>
        <p className="text-muted-foreground">
          {TODO_MESSAGES.EMPTY_STATE_SUBTITLE}
        </p>
      </CardContent>
    </Card>
  );
};
