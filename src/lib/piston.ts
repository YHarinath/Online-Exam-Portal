export async function executeCode(language: string, sourceCode: string) {
  const versions: Record<string, string> = {
    python: "3.10.0",
    javascript: "18.15.0",
    java: "15.0.2",
  };

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: language,
        version: versions[language] || "*",
        files: [
          {
            content: sourceCode,
          },
        ],
      }),
    });

    const data = await response.json();
    
    if (data.run) {
      return {
        output: data.run.stdout || data.run.stderr,
        error: data.run.stderr,
        time: "N/A", // Piston v2 doesn't always return time in the same format
      };
    }
    
    throw new Error(data.message || "Execution failed");
  } catch (error: any) {
    return {
      output: "",
      error: error.message,
      time: "0",
    };
  }
}
