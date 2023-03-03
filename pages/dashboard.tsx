import { useWorkSpan } from "@/hook/useWorkSpan";
import { Container, Paper, Button } from "@mui/material";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [nowTime, setNowTime] = useState<Date>(new Date(Date.now()));
  useEffect(() => {
    setInterval(() => {
      setNowTime(new Date(Date.now()));
    }, 10);
  }, []);
  const { todayWorkSpans, doEngraving } = useWorkSpan();
  const getKintaiStatus = (): "勤務中" | "退勤中" =>
    todayWorkSpans.length === 0
      ? "退勤中"
      : todayWorkSpans[todayWorkSpans.length - 1].endAt
      ? "退勤中"
      : "勤務中";
  return (
    <Container>
      <Paper sx={{ textAlign: "center", margin: 2, padding: 1 }}>
        <span style={{ fontSize: "50px", display: "block" }}>
          {nowTime.toLocaleDateString()}
        </span>
        <span style={{ fontSize: "120px", display: "block" }}>
          {nowTime.toLocaleTimeString()}
        </span>
        <span style={{ fontSize: "30px", display: "block" }}>
          {todayWorkSpans.length === 0
            ? "本日未打刻"
            : "最終打刻  " +
              new Date(
                todayWorkSpans[todayWorkSpans.length - 1].startAt
              ).toLocaleTimeString()}
        </span>
        <Button
          variant="contained"
          color={getKintaiStatus() === "勤務中" ? "error" : "success"}
          sx={{ fontSize: "50px", marginTop: 2 }}
          onClick={() => {
            doEngraving();
          }}
        >
          {getKintaiStatus() === "勤務中" ? "退勤" : "出勤"}
        </Button>
      </Paper>
      <ul>
        {todayWorkSpans.map((ws) => (
          <li>
            {new Date(ws.startAt).toLocaleTimeString()} -{" "}
            {ws.endAt == null
              ? "未打刻"
              : new Date(ws.endAt).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default DashboardPage;
