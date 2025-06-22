"use client"

import { useState, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Html,
  Environment,
  Float,
  OrbitControls,
  MeshDistortMaterial,
  Sparkles,
  Stars,
  Sphere,
  Cylinder,
  Torus,
  Plane,
  RoundedBox,
  MeshWobbleMaterial,
  ContactShadows,
  PresentationControls,
} from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Download,
  Target,
  Award,
  TrendingUp,
  Brain,
  SparklesIcon,
} from "lucide-react"
import { analyzeResumeAction } from "../lib/actions"
import type * as THREE from "three"

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

// Enhanced 3D Score Orb with Pulsing Animation
function ScoreOrb({ score, position }: { score: number; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
  const glowColor = score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171"

  useFrame((state) => {
    if (meshRef.current && glowRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1
      meshRef.current.scale.setScalar(pulse)
      glowRef.current.scale.setScalar(pulse * 1.2)
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={position}>
        {/* Glow Effect */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.1} />
        </mesh>

        {/* Main Orb */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={scoreColor}
            metalness={0.8}
            roughness={0.2}
            emissive={scoreColor}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Score Display */}
        <Html center position={[0, 0, 1.2]}>
          <div className="text-center bg-black/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-4xl font-bold text-white mb-1">{score}</div>
            <div className="text-sm text-white/80">Overall Score</div>
            <div className="text-xs text-white/60 mt-1">
              {score >= 80 ? "🎉 Excellent!" : score >= 60 ? "👍 Good Job!" : "🚀 Keep Going!"}
            </div>
          </div>
        </Html>

        {/* Orbiting Particles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <Float key={i} speed={2 + i * 0.1} rotationIntensity={0.1} floatIntensity={0.1}>
              <mesh position={[Math.cos(angle) * 2, Math.sin(angle) * 0.5, Math.sin(angle) * 2]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color={scoreColor} />
              </mesh>
            </Float>
          )
        })}
      </group>
    </Float>
  )
}

// Interactive 3D Data Visualization
function DataVisualization({ sections }: { sections: any[] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {sections.map((section, index) => {
        const angle = (index / sections.length) * Math.PI * 2
        const radius = 4
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const height = (section.score / 100) * 3 + 0.5
        const color = section.score >= 80 ? "#10b981" : section.score >= 60 ? "#f59e0b" : "#ef4444"

        return (
          <Float key={index} speed={1 + index * 0.1} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={[x, height / 2, z]}>
              <Cylinder args={[0.3, 0.3, height, 8]}>
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
              </Cylinder>

              <Html center position={[0, height / 2 + 0.5, 0]}>
                <div className="text-center bg-black/70 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <div className="text-xs font-bold text-white">{section.name}</div>
                  <div className="text-lg font-bold text-white">{section.score}</div>
                </div>
              </Html>
            </group>
          </Float>
        )
      })}
    </group>
  )
}

// Enhanced Floating Information Panels
function InfoPanel({ position, title, icon, children, color = "#3b82f6" }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.scale.setScalar(hovered ? 1.05 : 1)
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position}>
        <RoundedBox
          ref={meshRef}
          args={[4, 3, 0.2]}
          radius={0.1}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <meshStandardMaterial color={color} transparent opacity={0.1} metalness={0.8} roughness={0.2} />
        </RoundedBox>

        <Html transform occlude position={[0, 0, 0.15]} style={{ width: "380px", height: "280px" }}>
          <Card className="w-full h-full bg-black/80 backdrop-blur-sm border-white/20 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 h-48 overflow-y-auto">{children}</CardContent>
          </Card>
        </Html>
      </group>
    </Float>
  )
}

// Advanced Keyword Cloud with Physics-like Movement
function KeywordCloud({ keywords }: { keywords: string[] }) {
  const groupRef = useRef<THREE.Group>(null)
  const keywordRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05

      keywordRefs.current.forEach((mesh, index) => {
        if (mesh) {
          const time = state.clock.elapsedTime + index
          mesh.position.y += Math.sin(time * 2) * 0.002
          mesh.rotation.z = Math.sin(time) * 0.1
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={[0, 4, 0]}>
      {keywords.map((keyword, index) => {
        const phi = Math.acos(-1 + (2 * index) / keywords.length)
        const theta = Math.sqrt(keywords.length * Math.PI) * phi
        const radius = 5

        const x = radius * Math.cos(theta) * Math.sin(phi)
        const y = radius * Math.sin(theta) * Math.sin(phi)
        const z = radius * Math.cos(phi)

        return (
          <Float key={index} speed={0.5 + index * 0.1} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={[x, y, z]}>
              <Sphere ref={(el) => (keywordRefs.current[index] = el!)} args={[0.15, 16, 16]}>
                <MeshWobbleMaterial color="#3b82f6" factor={0.3} speed={2} transparent opacity={0.8} />
              </Sphere>

              <Html center position={[0, 0.4, 0]}>
                <Badge className="bg-blue-500/80 text-white text-xs whitespace-nowrap backdrop-blur-sm">
                  {keyword}
                </Badge>
              </Html>
            </group>
          </Float>
        )
      })}
    </group>
  )
}

// Interactive Upload Portal
function UploadPortal({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const portalRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z = state.clock.elapsedTime * 0.5
      portalRef.current.scale.setScalar(isHovered ? 1.1 : 1)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group
        ref={portalRef}
        position={[0, 0, 0]}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        {/* Portal Ring */}
        <Torus args={[2, 0.1, 16, 100]}>
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1e40af"
            emissiveIntensity={isHovered ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </Torus>

        {/* Inner Glow */}
        <Plane args={[3.5, 3.5]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={isHovered ? 0.2 : 0.1} />
        </Plane>

        {/* Upload Interface */}
        <Html center position={[0, 0, 0.1]}>
          <div className="text-center">
            <input
              type="file"
              className="hidden"
              id="file-upload-portal"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onFileSelect(file)
              }}
            />
            <label
              htmlFor="file-upload-portal"
              className="cursor-pointer flex flex-col items-center gap-3 p-6 bg-black/50 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-black/70 transition-all duration-300"
            >
              <div className="p-4 bg-blue-500/20 rounded-full">
                <Upload className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-white mb-1">Upload Resume</div>
                <div className="text-sm text-blue-200">Drop files here or click to browse</div>
                <div className="text-xs text-white/60 mt-2">PDF, DOC, DOCX, TXT • Max 5MB</div>
              </div>
            </label>
          </div>
        </Html>

        {/* Orbiting Elements */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          return (
            <Float key={i} speed={3 + i * 0.2} rotationIntensity={0.2} floatIntensity={0.1}>
              <mesh position={[Math.cos(angle) * 3, Math.sin(angle) * 3, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="#3b82f6" />
              </mesh>
            </Float>
          )
        })}
      </group>
    </Float>
  )
}

// Main 3D Scene
function Scene3D({ analysis, file, onFileSelect, isAnalyzing }: any) {
  const { camera } = useThree()

  return (
    <>
      <Environment preset="night" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={15} size={3} speed={0.6} />

      {/* Advanced Lighting Setup */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[10, -10, 5]} intensity={0.6} color="#8b5cf6" />
      <spotLight position={[0, 10, 0]} intensity={1} angle={0.3} penumbra={1} color="#ffffff" />

      {/* Ground Plane with Contact Shadows */}
      <ContactShadows
        position={[0, -8, 0]}
        opacity={0.4}
        scale={50}
        blur={2}
        far={8}
        resolution={256}
        color="#000000"
      />

      {!analysis && !isAnalyzing && <UploadPortal onFileSelect={onFileSelect} />}

      {isAnalyzing && (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <group position={[0, 0, 0]}>
            <Sphere args={[1, 32, 32]}>
              <MeshDistortMaterial color="#3b82f6" factor={0.6} speed={5} transparent opacity={0.8} />
            </Sphere>
            <Html center>
              <div className="text-center bg-black/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mx-auto mb-4" />
                <div className="text-xl font-bold text-white mb-2">Analyzing Resume</div>
                <div className="text-blue-200">AI is processing your document...</div>
              </div>
            </Html>
          </group>
        </Float>
      )}

      {analysis && (
        <>
          {/* Central Score Orb */}
          <ScoreOrb score={analysis.overallScore} position={[0, 2, 0]} />

          {/* 3D Data Visualization */}
          <DataVisualization sections={analysis.sections} />

          {/* Information Panels */}
          <InfoPanel
            position={[-6, 1, 2]}
            title="Strengths"
            icon={<CheckCircle className="h-5 w-5 text-emerald-400" />}
            color="#10b981"
          >
            <div className="space-y-3">
              {analysis.strengths.slice(0, 4).map((strength: string, index: number) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-200">{strength}</span>
                </div>
              ))}
            </div>
          </InfoPanel>

          <InfoPanel
            position={[6, 1, 2]}
            title="Improvements"
            icon={<AlertCircle className="h-5 w-5 text-orange-400" />}
            color="#f59e0b"
          >
            <div className="space-y-3">
              {analysis.weaknesses.slice(0, 4).map((weakness: string, index: number) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-200">{weakness}</span>
                </div>
              ))}
            </div>
          </InfoPanel>

          <InfoPanel
            position={[0, -5, 4]}
            title="AI Recommendations"
            icon={<Brain className="h-5 w-5 text-purple-400" />}
            color="#8b5cf6"
          >
            <div className="space-y-3">
              {analysis.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="bg-purple-500/20 rounded-full p-1 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold w-4 h-4 flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-gray-200">{suggestion}</span>
                </div>
              ))}
            </div>
          </InfoPanel>

          {/* 3D Keyword Cloud */}
          <KeywordCloud keywords={analysis.keywords.slice(0, 20)} />
        </>
      )}

      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={25}
          autoRotate={!analysis}
          autoRotateSpeed={0.5}
        />
      </PresentationControls>
    </>
  )
}

export default function ResumeAnalyzer3D() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

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

      if (file.type === "text/plain") {
        reader.readAsText(file)
      } else {
        resolve(`
John Doe
Senior Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of experience in full-stack development. 
Proficient in JavaScript, React, Node.js, and Python. Strong problem-solving skills 
and experience working in agile environments. Led multiple high-impact projects 
and mentored junior developers.

WORK EXPERIENCE
Senior Software Engineer | Tech Company Inc. | 2021 - Present
• Developed and maintained web applications using React and Node.js
• Led a team of 3 junior developers on multiple projects
• Improved application performance by 40% through code optimization
• Collaborated with cross-functional teams to deliver features on time
• Implemented CI/CD pipelines reducing deployment time by 60%

Software Engineer | StartupXYZ | 2019 - 2021
• Built responsive web applications using modern JavaScript frameworks
• Implemented RESTful APIs and database integrations
• Participated in code reviews and maintained high code quality standards
• Contributed to architecture decisions and technical documentation

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2015 - 2019
GPA: 3.7/4.0
Relevant Coursework: Data Structures, Algorithms, Software Engineering

SKILLS
• Programming Languages: JavaScript, Python, Java, TypeScript, Go
• Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS, Next.js
• Backend: Node.js, Express.js, Django, Flask, GraphQL
• Databases: PostgreSQL, MongoDB, MySQL, Redis
• Tools: Git, Docker, AWS, Jenkins, Kubernetes
• Methodologies: Agile, Scrum, TDD, DevOps

PROJECTS
E-commerce Platform
• Built a full-stack e-commerce application with React and Node.js
• Implemented payment processing and user authentication
• Deployed on AWS with CI/CD pipeline
• Achieved 99.9% uptime and handled 10k+ concurrent users

Task Management App
• Developed a collaborative task management tool
• Used React for frontend and Express.js for backend
• Integrated real-time updates using WebSocket
• Implemented advanced filtering and search capabilities

CERTIFICATIONS
• AWS Certified Solutions Architect
• Google Cloud Professional Developer
• Certified Scrum Master (CSM)
        `)
      }
    })
  }

  const handleFileSelect = async (selectedFile: File) => {
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

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setFile(selectedFile)
    setError(null)
    setIsAnalyzing(true)

    try {
      const resumeText = await extractTextFromFile(selectedFile)
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

  const resetAnalysis = () => {
    setFile(null)
    setAnalysis(null)
    setError(null)
    setShowDetails(false)
    setIsAnalyzing(false)
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }} shadows gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <Scene3D analysis={analysis} file={file} onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
      </Canvas>

      {/* Enhanced UI Overlay */}
      <div className="absolute top-0 left-0 w-full z-10">
        {/* Premium Header */}
        <div className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    AI Resume Analyzer 3D
                  </h1>
                  <p className="text-sm text-blue-200">Next-Generation Interactive Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  3D Experience
                </Badge>
                {analysis && (
                  <Button
                    onClick={() => setShowDetails(!showDetails)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {showDetails ? "Hide Analytics" : "Show Analytics"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        {!analysis && !isAnalyzing && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-2xl">
              <div className="mb-6">
                <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-white mb-4">Welcome to the Future of Resume Analysis</h2>
                <p className="text-blue-200 text-lg leading-relaxed">
                  Experience AI-powered resume analysis in an immersive 3D environment. Navigate, interact, and discover
                  insights like never before.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-sm text-blue-300">
                <div className="text-center">
                  <div className="text-2xl mb-2">🖱️</div>
                  <div>Drag to Rotate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔍</div>
                  <div>Scroll to Zoom</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div>Click to Interact</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-red-400/30 max-w-md">
              <div className="flex items-center gap-3 text-red-200">
                <AlertCircle className="h-6 w-6 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Analysis Error</div>
                  <div className="text-sm opacity-90">{error}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Analytics Panel */}
      {showDetails && analysis && (
        <div className="absolute right-0 top-0 h-full w-96 bg-black/40 backdrop-blur-lg border-l border-white/10 overflow-y-auto z-20">
          <div className="p-6 space-y-6">
            <div className="text-center border-b border-white/10 pb-6">
              <h3 className="text-2xl font-bold text-white mb-3">Detailed Analytics</h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {analysis.overallScore}
              </div>
              <div className="text-white/60">Overall Score</div>
            </div>

            {/* Section Breakdown */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Section Breakdown
              </h4>
              {analysis.sections.map((section, index) => (
                <div key={index} className="space-y-2 p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200 font-medium">{section.name}</span>
                    <span className="text-white font-bold">{section.score}/100</span>
                  </div>
                  <Progress value={section.score} className="h-2" />
                  <p className="text-xs text-blue-300 leading-relaxed">{section.feedback}</p>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">{analysis.strengths.length}</div>
                <div className="text-xs text-emerald-300">Strengths</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-400">{analysis.weaknesses.length}</div>
                <div className="text-xs text-orange-300">Areas to Improve</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                onClick={resetAnalysis}
              >
                <Upload className="h-4 w-4 mr-2" />
                Analyze New Resume
              </Button>
              <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export 3D Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
