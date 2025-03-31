"use client";

import { useEffect, useCallback, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { useFrameSDK } from "~/hooks/useFrameSDK";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { PROJECT_TITLE } from "~/lib/constants";

function BugReportForm({ onSubmit, isSubmitting }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1 && title.trim()) {
      setStep(2);
    } else if (step === 2 && description.trim()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit({ title, description, severity });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{PROJECT_TITLE}</CardTitle>
        <CardDescription>
          {step === 1 && "Step 1: What's the bug title?"}
          {step === 2 && "Step 2: Describe the bug"}
          {step === 3 && "Step 3: Set severity and submit"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <div className="space-y-2">
            <Label htmlFor="title">Bug Title</Label>
            <Input
              id="title"
              placeholder="Enter a concise bug title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <Label htmlFor="description">Bug Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened and steps to reproduce"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium">Summary:</h3>
              <p className="text-sm"><strong>Title:</strong> {title}</p>
              <p className="text-sm"><strong>Description:</strong> {description.substring(0, 50)}...</p>
              <p className="text-sm"><strong>Severity:</strong> {severity}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack}>Back</Button>
        ) : (
          <div></div>
        )}
        
        {step < 3 ? (
          <Button onClick={handleNext} disabled={step === 1 && !title.trim() || step === 2 && !description.trim()}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Bug Report"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function SuccessCard({ onReset }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bug Report Submitted!</CardTitle>
        <CardDescription>
          Thank you for your report. The Vibes Engineering team has been notified.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          A notification has been sent to @hellno.eth on Warpcast.
          We'll review your report as soon as possible.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onReset} className="w-full">Report Another Bug</Button>
      </CardFooter>
    </Card>
  );
}

export default function Frame() {
  const { isSDKLoaded, sdk } = useFrameSDK();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async (bugData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real implementation, this would call your API endpoint
      // to store the bug report and send the notification
      console.log("Bug report submitted:", bugData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Log notification information - in a real implementation, 
      // you would use a different method to notify the team
      console.log(`Would notify @hellno.eth about new ${bugData.severity} bug report: ${bugData.title}`);
      
      // In a production environment, you might want to:
      // 1. Store the bug report in a database
      // 2. Send an email notification
      // 3. Create an issue in a project management tool
      // 4. Post to a webhook that triggers other actions
      
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting bug report:", err);
      setError("Failed to submit bug report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (sdk) {
      // Signal to the Farcaster parent app that the frame is ready
      sdk.actions.ready();
    }
  }, [sdk]);

  if (!isSDKLoaded) {
    return <div className="flex items-center justify-center h-[300px]">Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-2 px-2">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      {submitted ? (
        <SuccessCard onReset={handleReset} />
      ) : (
        <BugReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}
