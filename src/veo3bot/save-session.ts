import { launchVeo3Browser } from "./browser.js";

const VEO3_URL = "https://labs.google/fx/tools/flow";

/**
 * Chạy 1 lần: mở Chrome profile riêng của bot, bạn tự đăng nhập Google + Veo3
 * (kể cả 2FA nếu có). Vì dùng persistent context, đăng nhập được lưu tự động vào
 * profile ngay khi thực hiện — không cần bước lưu storageState hay nhấn Enter nữa.
 */
async function main() {
  const context = await launchVeo3Browser();
  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto(VEO3_URL);

  console.log("\n>>> Đăng nhập bằng tài khoản trieudev99@gmail.com trong cửa sổ Chrome vừa mở.");
  console.log(">>> Sau khi đăng nhập xong và thấy giao diện Flow, quay lại đây và nhấn Enter để đóng...\n");

  await new Promise<void>((resolve) => {
    process.stdin.once("data", () => resolve());
  });

  console.log("[save-session] đã lưu đăng nhập vào profile Chrome của bot.");
  await context.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
