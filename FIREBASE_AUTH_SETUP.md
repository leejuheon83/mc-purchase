# Firebase Authentication 설정 가이드

## 1. Firebase Console 설정

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택 (예: `mc-purchase`)

## 2. Authentication 활성화 (필수)

`auth/configuration-not-found` 오류는 이 단계를 건너뛸 때 발생합니다.

1. **Authentication** 메뉴 이동
2. 처음이면 **시작하기** 버튼 클릭
3. **Sign-in method** 탭
4. **Email/Password** 제공업체 선택
5. **사용 설정** 토글 ON
6. 저장

## 3. 첫 직원 사용자 추가

Firebase Console에서는 이메일 형식으로 사용자를 추가합니다.

- **사번 → 이메일 변환**: `사번@mc-purchase.internal`
- 예: 사번 `1111` (관리자) → `1111@mc-purchase.internal`
- 예: 사번 `120034` → `120034@mc-purchase.internal`

**방법 A: Firebase Console에서 수동 추가**

1. Authentication → Users → Add user
2. Email: `1111@mc-purchase.internal`
3. Password: 원하는 비밀번호 (6자 이상)

**방법 B: 앱에서 `createUserWithEmployeeNo` 사용**

관리자 전용 회원가입 페이지에서 `createUserWithEmployeeNo(employeeNo, password)` 호출.
(현재 앱에는 미구현, 필요 시 추가)

## 4. Vercel 환경 변수

Vercel 프로젝트 설정 → Environment Variables에 다음 추가:

| 변수명 | 설명 |
|--------|------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `{projectId}.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | (선택) Analytics Measurement ID |

Firebase Console → 프로젝트 설정 → 일반 → 내 앱 → SDK 설정에서 값 확인.

## 5. Firestore 사용자 프로필 (선택)

향후 `users/{uid}` 컬렉션에 프로필 저장 시:

```ts
// 예시 구조
{
  employeeId: "120034",
  name: "이주헌",
  department: "경영지원팀",
  isAdmin: false
}
```

`AuthContext`의 `buildAuthUser`가 자동으로 Firestore에서 조회합니다.

---

**참고**: MVP에서는 사번을 synthetic email로 매핑합니다. 엔터프라이즈 환경에서는 Custom Token 또는 SSO로 마이그레이션을 권장합니다.
