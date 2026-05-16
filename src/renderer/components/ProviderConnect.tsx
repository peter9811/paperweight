import { useState, useRef, useEffect } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { findPresetById, PROVIDER_PRESETS } from "@shared/email-providers";
import type { ProviderPreset } from "@shared/email-providers";
import {
  AppleLogo,
  GoogleLogo,
  MicrosoftLogo,
  ProtonLogo,
} from "@shared/provider-logos";

export { AppleLogo, GoogleLogo, MicrosoftLogo, ProtonLogo } from "@shared/provider-logos";

// ── Provider Select ──────────────────────────────────────────────────────────

export function ProviderSelect({
  onGmail,
  onMicrosoft,
  onApple,
  onProton,
  onImap,
}: {
  onGmail: () => void;
  onMicrosoft: () => void;
  onApple: () => void;
  onProton: () => void;
  onImap: () => void;
}): JSX.Element {
  return (
    <div className="space-y-4">
      <button
        className="btn btn-outline btn-block justify-start gap-3"
        onClick={onGmail}
      >
        <GoogleLogo />
        Connect with Google
      </button>

      <button
        className="btn btn-outline btn-block justify-start gap-3"
        onClick={onMicrosoft}
      >
        <MicrosoftLogo />
        Connect with Microsoft
      </button>

      <button
        className="btn btn-outline btn-block justify-start gap-3"
        onClick={onApple}
      >
        <AppleLogo />
        Connect with Apple
      </button>

      <button
        className="btn btn-outline btn-block justify-start gap-3"
        onClick={onProton}
      >
        <ProtonLogo />
        Connect with Proton Mail
      </button>

      <div className="divider">OR</div>

      <button
        className="btn btn-ghost btn-block justify-start gap-3"
        onClick={onImap}
      >
        <Mail className="w-5 h-5" aria-hidden="true" />
        Other email (IMAP)
      </button>
    </div>
  );
}

// ── Gmail Connect ─────────────────────────────────────────────────────────────

export function GmailConnect({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}): JSX.Element {
  const [step, setStep] = useState<"authorizing" | "success" | "error">(
    "authorizing",
  );
  const [error, setError] = useState("");
  const attemptRef = useRef(0);

  const handleConnect = async (): Promise<void> => {
    const thisAttempt = ++attemptRef.current;
    setStep("authorizing");
    setError("");

    const result = await window.api.startGmailAuth();

    if (attemptRef.current !== thisAttempt) return;

    if (result.success) {
      setStep("success");
      window.api.startSync();
      setTimeout(onSuccess, 1000);
    } else {
      setError(result.error || "Authorization failed");
      setStep("error");
    }
  };

  useEffect(() => {
    if (attemptRef.current !== 0) return;
    handleConnect();
  }, []);

  return (
    <div className="space-y-4">
      {step === "authorizing" && (
        <div className="flex flex-col items-center gap-4 py-10">
          <span className="loading loading-spinner loading-lg"></span>
          <div className="text-center mt-2">
            <p className="text-sm">Complete sign-in in your browser...</p>
            <p className="text-xs text-base-content/50 mt-1">
              Waiting for Google authorization
            </p>
          </div>
          <div className="flex gap-3 mt-6 w-full">
            <button className="btn btn-outline flex-1" onClick={handleConnect}>
              Retry
            </button>
            <button
              className="btn btn-ghost flex-1"
              onClick={() => {
                attemptRef.current++;
                onBack();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="text-success">
            <CheckCircle2 className="w-12 h-12" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium">Connected successfully!</p>
          <p className="text-xs text-base-content/50">
            Starting initial sync...
          </p>
        </div>
      )}

      {step === "error" && (
        <div className="space-y-4 py-6">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
          <div className="flex gap-3 w-full">
            <button className="btn btn-outline flex-1" onClick={handleConnect}>
              Try Again
            </button>
            <button className="btn btn-ghost flex-1" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Microsoft Connect ─────────────────────────────────────────────────────────

export function MicrosoftConnect({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}): JSX.Element {
  const [step, setStep] = useState<"authorizing" | "success" | "error">(
    "authorizing",
  );
  const [error, setError] = useState("");
  const attemptRef = useRef(0);

  const handleConnect = async (): Promise<void> => {
    const thisAttempt = ++attemptRef.current;
    setStep("authorizing");
    setError("");

    const result = await window.api.startMicrosoftAuth();

    if (attemptRef.current !== thisAttempt) return;

    if (result.success) {
      setStep("success");
      window.api.startSync();
      setTimeout(onSuccess, 1000);
    } else {
      setError(result.error || "Authorization failed");
      setStep("error");
    }
  };

  useEffect(() => {
    if (attemptRef.current !== 0) return;
    handleConnect();
  }, []);

  return (
    <div className="space-y-4">
      {step === "authorizing" && (
        <div className="flex flex-col items-center gap-4 py-10">
          <span className="loading loading-spinner loading-lg"></span>
          <div className="text-center mt-2">
            <p className="text-sm">Complete sign-in in your browser...</p>
            <p className="text-xs text-base-content/50 mt-1">
              Waiting for Microsoft authorization
            </p>
          </div>
          <div className="flex gap-3 mt-6 w-full">
            <button className="btn btn-outline flex-1" onClick={handleConnect}>
              Retry
            </button>
            <button
              className="btn btn-ghost flex-1"
              onClick={() => {
                attemptRef.current++;
                onBack();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="text-success">
            <CheckCircle2 className="w-12 h-12" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium">Connected successfully!</p>
          <p className="text-xs text-base-content/50">
            Starting initial sync...
          </p>
        </div>
      )}

      {step === "error" && (
        <div className="space-y-4 py-6">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
          <div className="flex gap-3 w-full">
            <button className="btn btn-outline flex-1" onClick={handleConnect}>
              Try Again
            </button>
            <button className="btn btn-ghost flex-1" onClick={onBack}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Server Row (compact IMAP/SMTP editor) ────────────────────────────────

export function ServerRow({
  label,
  host,
  port,
  tls,
  onHost,
  onPort,
  onTls,
}: {
  label: string;
  host: string;
  port: number;
  tls: boolean;
  onHost: (v: string) => void;
  onPort: (v: number) => void;
  onTls: (v: boolean) => void;
}): JSX.Element {
  return (
    <div>
      <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="input input-bordered input-sm flex-1 min-w-0"
          placeholder="Host"
          value={host}
          onChange={(e) => onHost(e.target.value)}
          required
        />
        <input
          type="number"
          className="input input-bordered input-sm w-20"
          placeholder="Port"
          value={port}
          onChange={(e) => onPort(parseInt(e.target.value, 10))}
          required
        />
        <label
          className="flex items-center gap-1.5 cursor-pointer select-none shrink-0"
          title="Implicit TLS"
        >
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={tls}
            onChange={(e) => onTls(e.target.checked)}
          />
          <span className="text-xs">TLS</span>
        </label>
      </div>
    </div>
  );
}

// ── Apple / iCloud Connect ───────────────────────────────────────────────

export function AppleConnect({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}): JSX.Element {
  const preset = findPresetById("apple")!;
  const [host, setHost] = useState(preset.imap.host);
  const [port, setPort] = useState(preset.imap.port);
  const [tls, setTls] = useState(preset.imap.tls);
  const [smtpHost, setSmtpHost] = useState(preset.smtp.host);
  const [smtpPort, setSmtpPort] = useState(preset.smtp.port);
  const [smtpTls, setSmtpTls] = useState(preset.smtp.tls);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await window.api.saveImapConfig({
      host,
      port,
      tls,
      allowSelfSigned: preset.allowSelfSigned ?? false,
      username,
      password,
      smtp: { host: smtpHost, port: smtpPort, tls: smtpTls },
    });
    setLoading(false);

    if (result.success) {
      window.api.startSync();
      onSuccess();
    } else {
      setError(result.error || "Connection failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="alert text-xs text-left">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <p>
            iCloud Mail requires third-party email access to connect over IMAP.
            This requires an app-specific password.{" "}
            {preset.supportUrl && (
              <a
                href={preset.supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Read more
              </a>
            )}
          </p>
          {preset.appSpecificPasswordUrl && (
            <p className="text-xs text-base-content mt-2">
              <a
                href={preset.appSpecificPasswordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Sign in to your Apple Account
              </a>
              {" > "} Sign-In and Security &gt; to generate one.
            </p>
          )}
        </div>
      </div>

      <details className="collapse collapse-arrow border border-base-300 rounded-lg">
        <summary className="collapse-title text-xs font-medium py-2 min-h-0">
          Server Settings
        </summary>
        <div className="collapse-content space-y-3 pb-3">
          <ServerRow
            label="IMAP"
            host={host}
            port={port}
            tls={tls}
            onHost={setHost}
            onPort={setPort}
            onTls={setTls}
          />
          <ServerRow
            label="SMTP"
            host={smtpHost}
            port={smtpPort}
            tls={smtpTls}
            onHost={setSmtpHost}
            onPort={setSmtpPort}
            onTls={setSmtpTls}
          />
        </div>
      </details>

      <div className="space-y-2">
        <label className="text-sm font-medium">Apple ID Email</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="you@icloud.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">App-Specific Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="xxxx-xxxx-xxxx-xxxx"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="alert alert-error text-sm">
          <span className="whitespace-pre-line">{error}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={loading}
        >
          {loading ? <><span className="loading loading-spinner loading-xs" /> Connecting...</> : "Connect"}
        </button>
        <button type="button" className="btn btn-ghost flex-1" onClick={onBack}>
          Back
        </button>
      </div>
    </form>
  );
}

// ── Proton Mail Connect ──────────────────────────────────────────────────

export function ProtonConnect({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}): JSX.Element {
  const preset = findPresetById("proton")!;
  const [host, setHost] = useState(preset.imap.host);
  const [port, setPort] = useState(preset.imap.port);
  const [tls, setTls] = useState(preset.imap.tls);
  const [smtpHost, setSmtpHost] = useState(preset.smtp.host);
  const [smtpPort, setSmtpPort] = useState(preset.smtp.port);
  const [smtpTls, setSmtpTls] = useState(preset.smtp.tls);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await window.api.saveImapConfig({
      host,
      port,
      tls,
      allowSelfSigned: preset.allowSelfSigned ?? false,
      username,
      password,
      smtp: { host: smtpHost, port: smtpPort, tls: smtpTls },
    });
    setLoading(false);

    if (result.success) {
      window.api.startSync();
      onSuccess();
    } else {
      setError(result.error || "Connection failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="alert text-xs text-left">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <p>
            Proton Mail connects over IMAP via{" "}
            {preset.supportUrl ? (
              <a
                href={preset.supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Proton Bridge
              </a>
            ) : (
              "Proton Bridge"
            )}
            , which must be running to sync.
          </p>
        </div>
      </div>

      <details className="collapse collapse-arrow border border-base-300 rounded-lg">
        <summary className="collapse-title text-xs font-medium py-2 min-h-0">
          Server Settings
        </summary>
        <div className="collapse-content space-y-3 pb-3">
          <ServerRow
            label="IMAP"
            host={host}
            port={port}
            tls={tls}
            onHost={setHost}
            onPort={setPort}
            onTls={setTls}
          />
          <ServerRow
            label="SMTP"
            host={smtpHost}
            port={smtpPort}
            tls={smtpTls}
            onHost={setSmtpHost}
            onPort={setSmtpPort}
            onTls={setSmtpTls}
          />
        </div>
      </details>

      <div className="space-y-2">
        <label className="text-sm font-medium">Proton Email</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="you@proton.me"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Bridge Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="alert alert-error text-sm">
          <span className="whitespace-pre-line">{error}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={loading}
        >
          {loading ? <><span className="loading loading-spinner loading-xs" /> Connecting...</> : "Connect"}
        </button>
        <button type="button" className="btn btn-ghost flex-1" onClick={onBack}>
          Back
        </button>
      </div>
    </form>
  );
}

// ── IMAP Connect ──────────────────────────────────────────────────────────────

interface FormState {
  host: string;
  port: number;
  tls: boolean;
  allowSelfSigned: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpTls: boolean;
}

function matchesPreset(preset: ProviderPreset, s: FormState): boolean {
  return (
    preset.imap.host === s.host &&
    preset.imap.port === s.port &&
    preset.imap.tls === s.tls &&
    (preset.allowSelfSigned ?? false) === s.allowSelfSigned &&
    preset.smtp.host === s.smtpHost &&
    preset.smtp.port === s.smtpPort &&
    preset.smtp.tls === s.smtpTls
  );
}

export function ImapConnect({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}): JSX.Element {
  const [presetId, setPresetId] = useState("custom");
  const [host, setHost] = useState("");
  const [port, setPort] = useState(993);
  const [tls, setTls] = useState(true);
  const [allowSelfSigned, setAllowSelfSigned] = useState(false);
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpTls, setSmtpTls] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const preset = findPresetById(presetId);

  const applyPreset = (id: string): void => {
    setPresetId(id);
    const p = findPresetById(id);
    if (p) {
      setHost(p.imap.host);
      setPort(p.imap.port);
      setTls(p.imap.tls);
      setAllowSelfSigned(p.allowSelfSigned ?? false);
      setSmtpHost(p.smtp.host);
      setSmtpPort(p.smtp.port);
      setSmtpTls(p.smtp.tls);
    }
  };

  const checkDrift = (next: Partial<FormState>): void => {
    if (!preset) return;
    const state: FormState = {
      host, port, tls, allowSelfSigned, smtpHost, smtpPort, smtpTls, ...next,
    };
    if (!matchesPreset(preset, state)) setPresetId("custom");
  };

  const updateHost = (v: string): void => { setHost(v); checkDrift({ host: v }); };
  const updatePort = (v: number): void => { setPort(v); checkDrift({ port: v }); };
  const updateTls = (v: boolean): void => { setTls(v); checkDrift({ tls: v }); };
  const updateAllowSelfSigned = (v: boolean): void => { setAllowSelfSigned(v); checkDrift({ allowSelfSigned: v }); };
  const updateSmtpHost = (v: string): void => { setSmtpHost(v); checkDrift({ smtpHost: v }); };
  const updateSmtpPort = (v: number): void => { setSmtpPort(v); checkDrift({ smtpPort: v }); };
  const updateSmtpTls = (v: boolean): void => { setSmtpTls(v); checkDrift({ smtpTls: v }); };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await window.api.saveImapConfig({
      host,
      port,
      tls,
      allowSelfSigned,
      username,
      password,
      smtp: { host: smtpHost, port: smtpPort, tls: smtpTls },
    });
    setLoading(false);

    if (result.success) {
      window.api.startSync();
      onSuccess();
    } else {
      setError(result.error || "Connection failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium">Provider</label>
        <select
          className="select select-bordered w-full"
          value={presetId}
          onChange={(e) => applyPreset(e.target.value)}
        >
          <option value="custom">Custom / Other</option>
          {PROVIDER_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {preset && (preset.appSpecificPasswordUrl || preset.notes || preset.supportUrl) && (
        <div className="alert text-xs text-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            {preset.appSpecificPasswordUrl && (
              <p>
                {preset.name} requires an app-specific password for third-party email access.{" "}
                {preset.supportUrl && (
                  <a
                    href={preset.supportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    Read more
                  </a>
                )}
              </p>
            )}
            {!preset.appSpecificPasswordUrl && preset.supportUrl && (
              <p>
                <a
                  href={preset.supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {preset.name} setup guide
                </a>
              </p>
            )}
            {preset.appSpecificPasswordUrl && (
              <p className="text-xs text-base-content mt-2">
                <a
                  href={preset.appSpecificPasswordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Generate an app-specific password
                </a>
              </p>
            )}
            {preset.notes && (
              <p className="text-xs text-base-content mt-2">{preset.notes}</p>
            )}
          </div>
        </div>
      )}

      <ServerRow
        label="IMAP"
        host={host}
        port={port}
        tls={tls}
        onHost={updateHost}
        onPort={updatePort}
        onTls={updateTls}
      />

      <label className="flex items-center gap-2 cursor-pointer select-none -mt-1">
        <input
          type="checkbox"
          className="toggle toggle-primary toggle-sm"
          checked={allowSelfSigned}
          onChange={(e) => updateAllowSelfSigned(e.target.checked)}
        />
        <span className="text-xs">Allow self-signed certificate</span>
      </label>

      <ServerRow
        label="SMTP"
        host={smtpHost}
        port={smtpPort}
        tls={smtpTls}
        onHost={updateSmtpHost}
        onPort={updateSmtpPort}
        onTls={updateSmtpTls}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Email / Username</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="alert alert-error text-sm">
          <span className="whitespace-pre-line">{error}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={loading}
        >
          {loading ? <><span className="loading loading-spinner loading-xs" /> Connecting...</> : "Connect"}
        </button>
        <button type="button" className="btn btn-ghost flex-1" onClick={onBack}>
          Back
        </button>
      </div>
    </form>
  );
}
