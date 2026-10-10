import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
};

export default function () {
  const url =
    __ENV.BASE_URL || "https://hemo-health-seven.vercel.app";

  const response = http.get(url);

  check(response, {
    "homepage returns HTTP 200": (r) => r.status === 200,
    "homepage contains HemoHealth": (r) =>
      r.body.includes("HEMOHEALTH"),
  });

  sleep(1);
}
