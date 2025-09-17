import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/memo")({
  component: RouteComponent,
});

interface Memo {
  id: number;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

function RouteComponent() {
  const [memos] = useState<Memo[]>([
    {
      id: 1,
      title: "아이디어 노트",
      content:
        "새로운 프로젝트 아이디어:\n- 할일 관리 앱\n- 메모 앱\n- 캘린더 통합",
      color: "#fef3c7",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: "회의 메모",
      content:
        "오늘 회의 내용:\n- 프로젝트 일정 논의\n- 리소스 배정\n- 다음 회의: 금요일",
      color: "#dbeafe",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: "장보기 목록",
      content: "마트에서 살 것:\n- 우유\n- 계란\n- 빵\n- 과일",
      color: "#dcfce7",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      title: "독서 목록",
      content:
        "읽고 싶은 책들:\n- Clean Code\n- 리팩토링\n- 실용주의 프로그래머",
      color: "#fce7f3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleMemoClick = (memo: Memo) => {
    console.log("메모 클릭:", memo);
  };

  const handleAddMemo = () => {
    console.log("새 메모 추가");
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>메모</h1>
          <p className="text-muted-foreground">
            포스트잇처럼 메모를 관리하세요. ({memos.length}개)
          </p>
        </div>
        <Button onClick={handleAddMemo}>
          <Plus className="mr-2 h-4 w-4" />새 메모
        </Button>
      </div>

      {memos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">아직 메모가 없습니다.</p>
            <p className="text-muted-foreground">
              첫 번째 메모를 만들어보세요!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {memos.map((memo) => (
            <Card
              key={memo.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              style={{ backgroundColor: memo.color }}
              onClick={() => handleMemoClick(memo)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="line-clamp-1 font-medium text-gray-800">
                    {memo.title}
                  </h3>
                  <p className="line-clamp-4 text-sm whitespace-pre-wrap text-gray-600">
                    {truncateContent(memo.content)}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {memo.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
