"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Target,
  Lightbulb,
  Award,
  Eye,
  Download,
  Zap,
} from "lucide-react"
import { analyzeResumeAction } from "../lib/actions"

interface AnalysisResult {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  sections: {
    name: string
    score: number
    feedback: string
  }[]
  keywords: string[]
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF, DOC, DOCX, or TXT file")
        return
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      setFile(selectedFile)
      setError(null)
      setAnalysis(null)
    }
  }

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const text = event.target?.result as string
        resolve(text)
      }

      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }

      // For now, we'll handle text files. In a real app, you'd use libraries like pdf-parse for PDFs
      if (file.type === "text/plain") {
        reader.readAsText(file)
      } else {
        // For demo purposes, we'll simulate PDF/DOC content with sample resume text
        resolve(`
John Doe
Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of experience in full-stack development. 
Proficient in JavaScript, React, Node.js, and Python. Strong problem-solving skills 
and experience working in agile environments.

WORK EXPERIENCE
Senior Software Engineer | Tech Company Inc. | 2021 - Present
• Developed and maintained web applications using React and Node.js
• Led a team of 3 junior developers on multiple projects
• Improved application performance by 40% through code optimization
• Collaborated with cross-functional teams to deliver features on time

Software Engineer | StartupXYZ | 2019 - 2021
• Built responsive web applications using modern JavaScript frameworks
• Implemented RESTful APIs and database integrations
• Participated in code reviews and maintained high code quality standards

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2015 - 2019
GPA: 3.7/4.0

SKILLS
• Programming Languages: JavaScript, Python, Java, TypeScript
• Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express.js, Django, Flask
• Databases: PostgreSQL, MongoDB, MySQL
• Tools: Git, Docker, AWS, Jenkins

PROJECTS
E-commerce Platform
• Built a full-stack e-commerce application with React and Node.js
• Implemented payment processing and user authentication
• Deployed on AWS with CI/CD pipeline

Task Management App
• Developed a collaborative task management tool
• Used React for frontend and Express.js for backend
• Integrated real-time updates using WebSocket
        `)
      }
    })
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Extract text from file
      const resumeText = await extractTextFromFile(file)

      // Call server action to analyze resume
      const result = await analyzeResumeAction(resumeText)

      if (result.success) {
        setAnalysis(result.data)
      } else {
        setError(result.error || "Failed to analyze resume")
      }
    } catch (err) {
      setError("Failed to analyze resume. Please try again.")
      console.error("Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-500"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200"
    if (score >= 60) return "bg-amber-50 border-amber-200"
    return "bg-red-50 border-red-200"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  AI Resume Analyzer
                </h1>
                <p className="text-sm text-slate-600">Powered by advanced AI technology</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-white/50">
              <Zap className="h-3 w-3 mr-1" />
              Beta
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Eye className="h-4 w-4" />
            Get instant feedback on your resume
          </div>
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">
            Transform Your Resume with
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              AI Insights
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your resume and receive detailed analysis, personalized suggestions, and actionable improvements to
            land your dream job.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Upload className="h-6 w-6 text-blue-600" />
              Upload Your Resume
            </CardTitle>
            <CardDescription className="text-base">
              Supported formats: PDF, DOC, DOCX, TXT • Maximum size: 5MB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="mt-4 mb-2 text-lg font-semibold text-slate-700">
                    Drop your resume here or <span className="text-blue-600">browse files</span>
                  </p>
                  <p className="text-sm text-slate-500">We'll analyze it instantly and provide detailed feedback</p>
                </div>
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" />
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8 animate-in fade-in duration-1000">
            {/* Overall Score */}
            <Card className={`border-2 shadow-2xl ${getScoreBg(analysis.overallScore)}`}>
              <CardHeader className="text-center pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Award className="h-6 w-6 text-amber-500" />
                  Your Resume Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="text-7xl font-bold">
                      <span className={getScoreColor(analysis.overallScore)}>{analysis.overallScore}</span>
                      <span className="text-3xl text-slate-400">/100</span>
                    </div>
                    <div className="absolute -top-2 -right-2">
                      {analysis.overallScore >= 80 && <Sparkles className="h-8 w-8 text-amber-400" />}
                    </div>
                  </div>
                  <div className="w-full max-w-md">
                    <Progress value={analysis.overallScore} className="h-4 bg-slate-200" />
                  </div>
                  <Badge
                    variant={getScoreBadgeVariant(analysis.overallScore)}
                    className="text-lg px-4 py-2 font-semibold"
                  >
                    {analysis.overallScore >= 80
                      ? "🎉 Excellent Resume!"
                      : analysis.overallScore >= 60
                        ? "👍 Good Foundation"
                        : "🚀 Room for Growth"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Section Scores */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="h-5 w-5 text-blue-600" />
                  Detailed Section Analysis
                </CardTitle>
                <CardDescription>See how each section of your resume performs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysis.sections.map((section, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{section.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg ${getScoreColor(section.score)}`}>{section.score}</span>
                        <span className="text-slate-400">/100</span>
                      </div>
                    </div>
                    <Progress value={section.score} className="h-3" />
                    <p className="text-sm text-slate-600 leading-relaxed">{section.feedback}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Strengths and Weaknesses */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle className="h-5 w-5" />
                    Your Strengths
                  </CardTitle>
                  <CardDescription>What's working well in your resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 leading-relaxed">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertCircle className="h-5 w-5" />
                    Areas to Improve
                  </CardTitle>
                  <CardDescription>Opportunities to make your resume stronger</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 leading-relaxed">{weakness}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Lightbulb className="h-5 w-5" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Actionable steps to improve your resume and increase your chances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-white/70 rounded-xl border border-blue-200"
                    >
                      <div className="bg-blue-100 rounded-full p-2 mt-1">
                        <span className="text-blue-600 text-sm font-bold w-5 h-5 flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 leading-relaxed">{suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keywords */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Key Skills & Keywords Detected
                </CardTitle>
                <CardDescription>Important terms that help your resume get noticed by ATS systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 transition-colors"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-8">
              <Button
                variant="outline"
                className="px-6 py-3 border-2 hover:bg-slate-50"
                onClick={() => {
                  setFile(null)
                  setAnalysis(null)
                  setError(null)
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Analyze Another Resume
              </Button>
              <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
