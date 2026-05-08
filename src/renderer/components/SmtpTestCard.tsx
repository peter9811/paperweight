import { useState } from "react";

const TEST_RECIPIENT = "hello@paperweight.email";
const TEST_SUBJECT = "test";
const TEST_BODY = "test";

type Result = { ok: true } | { ok: false; error: string };

export default function SmtpTestCard(): JSX.Element {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleSend = async (): Promise<void> => {
    setSending(true);
    setResult(null);
    try {
      const res = await window.api.sendEmail(
        TEST_RECIPIENT,
        TEST_SUBJECT,
        TEST_BODY,
      );
      if (res.success) setResult({ ok: true });
      else setResult({ ok: false, error: res.error ?? "Unknown error" });
    } catch (err) {
      setResult({
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="card bg-base-200 border border-warning/30">
      <div className="card-body space-y-3">
        <h3 className="font-semibold">SMTP / Send Test</h3>
        <p className="text-sm text-base-content/60">
          Sends a test email from the active account to{" "}
          <span className="font-mono">{TEST_RECIPIENT}</span> (subject:{" "}
          <span className="font-mono">{TEST_SUBJECT}</span>, body:{" "}
          <span className="font-mono">{TEST_BODY}</span>).
        </p>
        <button
          className="btn btn-warning btn-sm w-fit"
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            "Send test email"
          )}
        </button>
        {result?.ok === true && (
          <p className="text-xs text-success">Sent successfully.</p>
        )}
        {result?.ok === false && (
          <p className="text-xs text-error break-all">Failed: {result.error}</p>
        )}
      </div>
    </div>
  );
}
