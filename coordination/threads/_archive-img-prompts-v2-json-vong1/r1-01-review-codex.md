# r1-01 — Review Codex cho SPEC v2, bản v1

Artifact: `image-prompts/SPEC-v2.md`  
Kết luận: **Chưa chốt v1.** Cần sửa hợp đồng tham chiếu asset và cách phân loại người vô danh trước khi chuyển 385 dòng. Không yêu cầu chuyển dữ liệu hay sửa runner trong vòng này.

Đã đọc THREAD, bản đề xuất r1-00 và toàn bộ SPEC v1. Các điểm mới dùng D05–D09, tiếp sau D01–D04 của tác giả.

## D05 — CHAN — Mã asset nội bộ đang được truyền như tên trên Flow

**CHỖ NÀO:** `image-prompts/SPEC-v2.md:129`, đối chiếu dòng 165, 169 và 232.

**VẤN ĐỀ GÌ:** Spec hướng dẫn truyền `reference: [assetId]`. Nhưng ví dụ có hai giá trị khác nhau:

- `id`: `char-reles`
- `flowAssetName`: `Heavyset Man Dark Hair Pinstripe`

`attachExistingAssets` tìm theo tên trên Flow và yêu cầu khớp chính xác (`src/veo3bot/imageAsset.ts:273`, `:283`, `:306`). Truyền `["char-reles"]` không tìm được ảnh mang tên còn lại.

Ngoài ra, mục 6 chỉ nói bổ sung cột `kind` và `useAsset` vào TSV. Chưa xác định runner nhận `produces` và bảng ánh xạ tên bằng cách nào. Runner hiện lấy tên ảnh từ `nameFor(row.prompt)` (`scripts/try-image-prompts.ts:80`); tên đó không mặc nhiên bằng `flowAssetName`.

**CẦN GÌ ĐỂ ĐÓNG:** Chốt ngay trong spec đường dữ liệu từ JSON đến runner: shot có `produces` được tạo/đổi tên theo giá trị nào, và `useAsset` được tra qua `assets[].id` để lấy `flowAssetName` trước khi đính. Nếu giữ TSV làm đầu vào runner, chỉ rõ thông tin ánh xạ được chuyển qua TSV hay được đọc từ JSON đi kèm. Minh họa bằng chính `char-reles`; chưa cần sửa code.

## D06 — CHAN — Năm loại hiện tại không chứa được người đơn lẻ vô danh

**CHỖ NÀO:** `image-prompts/SPEC-v2.md:93`, đối chiếu dòng 138–142.

**VẤN ĐỀ GÌ:** `character` chỉ dành cho người có thật, bắt buộc có tư liệu; `group` dành cho nhiều người. Nhưng dữ liệu cần chuyển đã có:

- `image-prompts/SHOT-LIST.md:89`: A1-05, một bác sĩ viết trên bảng kẹp giấy.
- `image-prompts/SHOT-LIST.md:96`: A1-12, một cảnh sát đứng gác.
- `image-prompts/SHOT-LIST.md:101`: A1-17, một cảnh sát ngủ trên ghế.

Đây là những vai minh họa không có danh tính cụ thể để tìm chân dung. Không loại nào trong bảng chứa đúng chúng. Quy tắc thiếu ảnh thì đổi sang `group` hoặc `object` cũng có thể buộc đổi nội dung từ một người thành nhiều người hoặc đồ vật, trái cam kết giữ nội dung hiện có.

**CẦN GÌ ĐỂ ĐÓNG:** Định nghĩa được người đơn lẻ không cần nhận diện. Có thể mở rộng `character` và phân biệt người xác định danh tính với vai minh họa, hoặc bổ sung loại tương ứng. Chỉ yêu cầu tư liệu chân dung khi cần tái hiện danh tính; tư liệu trang phục vẫn theo bối cảnh. Gán thử loại cho ba dòng trên và một trường hợp nhân vật lịch sử không có chân dung đáng tin.

## D07 — SUA — `cue` mẫu không phải trích dẫn từ transcript

**CHỖ NÀO:** `image-prompts/SPEC-v2.md:199`, đối chiếu dòng 216 và 223–225.

**VẤN ĐỀ GÌ:** A1-13 dùng:

> found dead on the kitchen roof

Transcript ghi ở `input/style-ref/brofessor-stein/nRiezhIOHH0/transcript.md:5`:

> found dead on the roof of the hotel's

Từ `kitchen` nằm trong khối tiếp theo ở dòng 7. Câu trong JSON là diễn đạt lại, không phải đoạn chữ có thể tìm nguyên văn.

Đã phân tích khối JSON bằng `ConvertFrom-Json` và đối chiếu sau khi bỏ mốc thời gian, gộp khoảng trắng: cue A1-01 và A1-03 tìm thấy; A1-13 không tìm thấy. Như vậy ví dụ chưa đáp ứng chính cơ chế neo mà spec đề xuất. Việc xuống dòng khi đổi `--block` cũng cần được xử lý, thay vì mặc định `grep` luôn tìm được.

**CẦN GÌ ĐỂ ĐÓNG:** Sửa cue mẫu thành trích dẫn thật. Quy định đối chiếu trên văn bản đã chuẩn hóa mốc thời gian/khoảng trắng, trong phạm vi segment; cue không khớp hoặc khớp nhiều chỗ phải được làm rõ. Không cần bắt buộc thêm `end` cho từng phần tử chỉ để sửa lỗi này.

## D08 — SUA — Tư liệu thay thế chưa phân biệt hình dung về nhân vật với bằng chứng ngoại hình

**CHỖ NÀO:** `image-prompts/SPEC-v2.md:140`, đối chiếu manifest ở dòng 70–77.

**VẤN ĐỀ GÌ:** Spec cho dùng tranh cùng thời, tượng đài và tem để đi tiếp sang mô tả ngoại hình người thật, nhưng chưa yêu cầu ghi tư liệu đó được tạo khi nào và xác nhận được điều gì. Tượng đài hoặc tem tưởng niệm không tự chứng minh khuôn mặt thật của người được tưởng niệm.

Ngay trong việc tìm A1 đã gặp hai trường hợp cần phân biệt:

- Bộ ảnh Half Moon Hotel của Center for Brooklyn History được chụp năm **1991**, khi công trình đã là viện dưỡng lão; không thể tự ghi thành ngoại thất năm 1941. [Hồ sơ bộ sưu tập](https://findingaids.library.nyu.edu/cbh/v1991_074_half_moon_hotel/).
- Bộ sưu tập ice pick ghi ngày cấp bằng sáng chế **1930**; đó không mặc nhiên là năm sản xuất hiện vật được chụp. [Capped Handles](https://icetoolcollection.com/1p3cappedhandles.htm).

Manifest hiện có thể chứa ghi chú trong `shows`, nhưng chưa có quy tắc bắt buộc giữ các phân biệt này. Agent sau dễ coi mọi ảnh trong `refs` là bằng chứng ngang nhau.

**CẦN GÌ ĐỂ ĐÓNG:** Yêu cầu mỗi tư liệu ghi loại nguồn, niên đại biết được hoặc “chưa rõ”, và phạm vi dùng: ngoại hình được ghi nhận, hình dung về sau, trang phục hay hình dáng vật thể. Có thể dùng trường riêng hoặc ghi chú có quy ước. Nhân vật chỉ có hình dung về sau phải được đánh dấu là minh họa suy đoán, không mô tả như chân dung đã xác minh.

## D09 — SUA — Quy tắc vận hành cũ đang được trình bày thành kết luận bao quát về chính sách hiện tại

**CHỖ NÀO:** `image-prompts/SPEC-v2.md:17`, đặc biệt dòng 19–24.

**VẤN ĐỀ GÌ:** Đây là bằng chứng bổ sung cho D01 của tác giả, không phải một lần đo Flow mới.

RUNBOOK có ghi nhận cũ về việc tên người thật bị chặn (`RUNBOOK.md:2302`). Nhưng từ đó chưa đủ kết luận hiện tại rằng mọi tên người thật đều bị Nano Banana/Gemini chặn, hoặc riêng chuỗi `Abe Reles` chắc chắn không dùng được.

Tài liệu chính thức đang truy cập được của Flow cấm tạo **video** về người nổi tiếng; đồng thời nói khả năng tạo ảnh/video liên quan nhóm này có thể khác theo khu vực. Nguồn đó không xác nhận quy tắc bao quát cho ảnh tĩnh, cũng không cho phép kết luận ranh giới chỉ là người còn sống hay đã chết. [Google Flow Help](https://support.google.com/flow/answer/16353544?hl=en).

Các bài hỏi đáp cộng đồng xuất hiện trong tìm kiếm không được dùng làm căn cứ chính sách chính thức.

**CẦN GÌ ĐỂ ĐÓNG:** Đổi phần này thành quy ước vận hành dựa trên quan sát trước đây, ghi rõ phạm vi hiện chưa đo lại; bỏ khẳng định chắc chắn về mọi người thật và về riêng Abe Reles. Nếu muốn giữ kết luận thực nghiệm rộng hơn, cần bằng chứng có ngày thử, sản phẩm, model, chế độ ảnh và kết quả cụ thể. Không cần chạy phép thử tạo ảnh trong vòng chỉ đọc này để sửa cách phát biểu.

## Trả lời các câu hỏi của tác giả

- **Tên người thật:** Chưa xác nhận lại bằng thực nghiệm; tài liệu công khai chưa đủ trả lời “mọi người nổi tiếng hay chỉ người còn sống”. Xem D09.
- **Schema có thiếu trường hợp không:** Có trường hợp người vô danh đơn lẻ ngay trong A1, cùng hợp đồng ánh xạ asset chưa hoàn chỉnh; xem D05–D06.
- **Có cần `end` từng shot không:** Chưa thấy cần bắt buộc ở bước này. `at` kết hợp cue khớp rõ trong segment đủ chỉ đoạn lời đang minh họa; thời điểm tắt phần tử thuộc việc dựng. Cần sửa cách đối chiếu cue theo D07.
- **Đuôi `__<agent>` trên Windows:** Bản thân `__claude`, `__codex`, `__gemini` không chứa ký tự tên file bị cấm. Các tên mẫu cũng không có lỗi ký tự này. Đây là đối chiếu quy tắc, chưa phải thử tạo file. [Quy tắc đặt tên file của Microsoft](https://learn.microsoft.com/th-th/windows/win32/fileio/naming-a-file).

## Nguồn ảnh A1 do Codex tìm

Các URL dưới đây là **ứng viên tư liệu**, chưa phải file đã tải hoặc ảnh đã được duyệt bằng mắt. `THAY GI` ghi theo mô tả của nguồn hoặc kết quả tìm ảnh, không phải mô tả ngoại hình đã xác minh. Không chép chúng thành manifest của file đang tồn tại.

### REF-A1-CODEX-01 — Abe Reles

URL: https://cdn.loc.gov/service/pnp/cph/3c10000/3c14000/3c14600/3c14637_150px.jpg  
TRANG: https://www.loc.gov/pictures/item/95511453/  
CHO: A1-01  
THAY GI: Theo danh mục LOC: chân dung đầu và vai Abe Reles, hướng sang phải, niên đại khoảng 1930–1941.  
TRUY VAN: Abe Reles photograph mugshot Wikimedia Commons

Đã lần từ kết quả Wikimedia sang hồ sơ LOC. URL trên là thumbnail được hồ sơ LOC công bố; chưa đủ để duyệt chi tiết khuôn mặt. Không gọi ảnh này là mugshot năm 1940. [Hồ sơ LOC](https://www.loc.gov/pictures/item/95511453/).

### REF-A1-CODEX-02 — Half Moon Hotel, tư liệu bổ sung chưa xác định năm

URL: https://www.boweryboyshistory.com/wp-content/uploads/2013/09/114.jpg  
TRANG: https://www.boweryboyshistory.com/2013/09/the-big-crowd-kevin-baker-takes-on.html  
CHO: A1-11  
THAY GI: Kết quả tìm ảnh nhận diện một bưu thiếp ngoại thất Half Moon Hotel và boardwalk tại Coney Island; chưa xác minh năm ảnh.  
TRUY VAN: Half Moon Hotel Coney Island 1941

Đây là kết quả `image_query`, chưa đạt yêu cầu xác nhận ngoại thất **năm 1941**. Trang chứa ảnh xác định công trình là Half Moon Hotel. [Trang Bowery Boys](https://www.boweryboyshistory.com/2013/09/the-big-crowd-kevin-baker-takes-on.html).

Đã tìm thêm hồ sơ phù hợp hơn: ảnh công trình do Hemmer/New York Daily News chụp **12-11-1941**, Getty số **2265487109**. Chưa lấy được URL ảnh trực tiếp, nên giữ dưới dạng đầu mối, không giả thành bản ghi ảnh hoàn chỉnh. Truy vấn: `"Half Moon Hotel" "Coney Island" "1941" photograph exterior`. [Hồ sơ Getty](https://www.gettyimages.be/detail/nieuwsfoto%27s/the-half-moon-hotel-in-coney-island-new-york-scene-of-abe-nieuwsfotos/2265487109?slot=22).

### REF-A1-CODEX-03 — Cảnh sát New York đầu thập niên 1940

URL: https://cdn.loc.gov/service/pnp/fsa/8d22000/8d22200/8d22267v.jpg  
TRANG: https://www.loc.gov/pictures/item/2017836691/  
CHO: A1-12, A1-17  
THAY GI: Theo danh mục LOC: cảnh sát người Mỹ gốc Ireland tại Central Park, ảnh Marjory Collins, tháng 9-1942.  
TRUY VAN: Marjory Collins Irish American policeman Central Park 1942 Library Congress

Dùng để tham khảo trang phục gần thời kỳ; không phải ảnh người gác Reles hoặc bằng chứng trang phục tại khách sạn năm 1941. URL JPEG lớn được liệt kê trực tiếp trong hồ sơ. [Hồ sơ LOC](https://www.loc.gov/pictures/item/2017836691/).

### REF-A1-CODEX-04 — Ice pick, mẫu có thông tin bằng sáng chế 1930

URL: https://icetoolcollection.com/1p3cappedhandles_files/image002.jpg  
TRANG: https://icetoolcollection.com/1p3cappedhandles.htm  
CHO: A1-03  
THAY GI: Theo trang bộ sưu tập: ice pick Bridgeport No.2 Chipless, cán có lò xo; mục này ghi bằng sáng chế số 1,781,475 cấp ngày 11-11-1930.  
TRUY VAN: "ice pick" "1930" "collection"

URL được lấy từ liên kết ảnh của mục tương ứng. Chưa xác minh niên đại sản xuất hiện vật, chưa có căn cứ nói đây là loại Reles đã dùng. [Trang bộ sưu tập](https://icetoolcollection.com/1p3cappedhandles.htm).

### Nhật ký truy vấn ảnh chưa cho ứng viên đủ điều kiện

“Chưa cho ứng viên đủ điều kiện” không đồng nghĩa công cụ trả về không kết quả.

| Truy vấn nguyên văn | Kết quả cần lưu |
| --- | --- |
| `Half Moon Hotel Coney Island 1941 photograph library` | Có NYPL, CIHP và bộ ảnh năm 1991; chưa có URL ảnh xác nhận năm 1941. |
| `site:loc.gov New York policeman 1940 photograph uniform` | Chưa tìm được hồ sơ ảnh phù hợp; kết quả có finding aid. |
| `site:americanhistory.si.edu "ice pick"` | Có hiện vật Smithsonian, nhưng danh mục ghi thế kỷ XIX. |
| `"New York" "policeman" "1941" photograph uniform` | Chưa chọn được ảnh có nguồn và niên đại đủ rõ. |
| `"ice pick" "1930" museum` | Chưa chọn được hiện vật phù hợp. |
| `"New York" "police" "1940" site:loc.gov/item` | Chưa có ảnh đồng phục đủ cụ thể. |
| `"Half Moon Hotel" site:commons.wikimedia.org/wiki/File` | Kết quả chủ yếu là các địa điểm trùng tên tại Anh/Wales. |
| `New York policeman 1940 uniform` — tìm ảnh | Có bản đăng lại và đầu mối Marjory Collins 1942; đã lần tiếp tới LOC. |
| `site:loc.gov "Irish-American" "policeman" "1942"` | Chưa thu được hồ sơ dùng ngay từ lượt này; truy vấn đầy đủ tên tác giả sau đó cho kết quả. |
| `Half Moon Hotel 2265487109` — tìm ảnh | Trả về khách sạn trùng tên khác địa điểm. |
| `ice pick site:icetoolcollection.com/1p3cappedhandles.htm` — tìm ảnh | Không thu được ứng viên ảnh từ lượt này. |
| `"Half Moon Hotel" "Coney Island" site:gettyimages.com` — tìm ảnh | Công cụ trả “Empty search results”. |
| `"Abe Reles" portrait site:loc.gov` — tìm ảnh | Công cụ trả “Empty search results”. |

D02 chưa được kiểm bằng file thật. D04 đã có đầu mối cho cả bốn nhóm, nhưng chưa đủ để chốt rằng bốn ảnh đã được xác minh và sẵn sàng dùng.

## Toi da khong kiem cai gi

- Không tạo hoặc sửa file, kể cả THREAD, manifest và ảnh tải về.
- Không chạy Flow/Gemini hoặc tạo ảnh. Chưa đo bộ lọc tên người thật, khả năng giữ danh tính, phong cách hay hiệu quả prompt.
- Không duyệt ảnh nguồn bằng mắt. `web.run` mở các URL ảnh LOC, Bowery Boys và Ice Tool Collection gặp lỗi truy cập/cache hoặc báo URL không mở được. Vì vậy chưa xác minh độ nét, chi tiết ngoại hình và mức phù hợp để viết prompt.
- Với ảnh Getty năm 1941, tìm kiếm đọc được hồ sơ nhưng mở trang gặp lỗi; `Invoke-WebRequest` cũng bị đóng kết nối. Chưa lấy được URL ảnh trực tiếp hoặc kiểm nội dung ảnh.
- PowerShell không cho đổi `Console.OutputEncoding` trong chế độ ngôn ngữ hạn chế; đã đọc lại các đoạn cần đối chiếu bằng cách xuất ký tự Unicode có escape. `rg` và `python` không có trong PATH; đã dùng công cụ PowerShell thay thế. Những lỗi này không ngăn việc phân tích JSON mẫu và đối chiếu ba cue.
- Không kiểm hết 385 dòng, không kiểm lịch sử các vụ án hoặc toàn bộ transcript. Chỉ lấy các dòng liên quan để kiểm khả năng biểu diễn của spec.
- Không kiểm giấy phép ảnh, không kết luận quyền đưa ảnh trực tiếp vào video. Không mở lại tranh luận D17 của luồng cũ.
- Không chạy runner, build hay migration. Bằng chứng về tên asset là đối chiếu code hiện có; chưa phải kết quả chạy schema mới.

```points
D05 | mở | image-prompts/SPEC-v2.md:129 | CHAN: assetId khác flowAssetName; chưa chốt đường truyền ánh xạ và tên ảnh được tạo tới runner
D06 | mở | image-prompts/SPEC-v2.md:93 | CHAN: năm kind không biểu diễn được người đơn lẻ vô danh đã có trong A1
D07 | mở | image-prompts/SPEC-v2.md:199 | SUA: cue A1-13 không khớp transcript kể cả sau chuẩn hóa khoảng trắng
D08 | mở | image-prompts/SPEC-v2.md:140 | SUA: tư liệu thay thế chưa bắt buộc phân biệt niên đại và mức xác nhận ngoại hình
D09 | mở | image-prompts/SPEC-v2.md:19 | SUA: bằng chứng bổ sung cho D01 chưa hỗ trợ kết luận mọi tên người thật bị chặn trong chế độ ảnh hiện tại
```