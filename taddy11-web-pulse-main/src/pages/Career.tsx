import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Send, 
  Upload,
  Briefcase,
  CheckCircle,
  Star,
  Award,
  Heart,
  Coffee,
  Zap
} from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface JobPosition {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary: string;
  experience: string;
  benefits: string[];
  isActive: boolean;
  createdAt: string;
}

const Career = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
    experience: "",
    skills: "",
    coverLetter: "",
    preferredRole: "",
    availability: "",
    expectedSalary: ""
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/jobs/public`);
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch job positions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });
    
    if (resumeFile) {
      submitData.append('resume', resumeFile);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/applications/general`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Application Submitted!",
          description: "Thank you for your interest. We'll review your application and get back to you soon.",
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          linkedIn: "",
          portfolio: "",
          experience: "",
          skills: "",
          coverLetter: "",
          preferredRole: "",
          availability: "",
          expectedSalary: ""
        });
        setResumeFile(null);
        setIsDialogOpen(false);
      }
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Please try again later",
        variant: "destructive",
      });
    }
  };

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance"
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description: "Flexible PTO and remote work options"
    },
    {
      icon: Award,
      title: "Growth & Learning",
      description: "Professional development budget and training"
    },
    {
      icon: Zap,
      title: "Modern Tools",
      description: "Latest equipment and cutting-edge technology"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-purple-600">Loading career opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Join Our <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Team</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Build the future of technology with us. We're looking for passionate individuals 
              who want to make a difference in the world of innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" size="lg">
                    <Send className="h-5 w-5 mr-2" />
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Submit Your Application</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to apply for a position at Sisuni Tech
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="preferredRole">Preferred Role *</Label>
                        <Select value={formData.preferredRole} onValueChange={(value) => setFormData(prev => ({ ...prev, preferredRole: value }))}>
                          <SelectTrigger className="border-purple-200 focus:border-purple-500">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {jobs.map((job) => (
                              <SelectItem key={job._id} value={job.title}>
                                {job.title}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                        <Input
                          id="linkedIn"
                          name="linkedIn"
                          value={formData.linkedIn}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="portfolio">Portfolio/Website</Label>
                        <Input
                          id="portfolio"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          placeholder="https://yourportfolio.com"
                          className="border-purple-200 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="experience">Years of Experience *</Label>
                        <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                          <SelectTrigger className="border-purple-200 focus:border-purple-500">
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="availability">Availability *</Label>
                        <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                          <SelectTrigger className="border-purple-200 focus:border-purple-500">
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                            <SelectItem value="1-month">1 month notice</SelectItem>
                            <SelectItem value="2-months">2+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="expectedSalary">Expected Salary</Label>
                      <Input
                        id="expectedSalary"
                        name="expectedSalary"
                        value={formData.expectedSalary}
                        onChange={handleInputChange}
                        placeholder="e.g., $80,000 - $100,000"
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="skills">Key Skills *</Label>
                      <Textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="List your key technical skills, programming languages, frameworks, etc."
                        required
                        className="border-purple-200 focus:border-purple-500"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="coverLetter">Cover Letter *</Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                        required
                        className="border-purple-200 focus:border-purple-500"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="resume">Resume (PDF, DOC) *</Label>
                      <Input
                        id="resume"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        required
                        className="border-purple-200 focus:border-purple-500"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="lg"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      Submit Application
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="lg" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                View Open Positions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Sisuni Tech?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer more than just a job - we provide a platform for growth, innovation, and impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={benefit.title} className="text-center hover:shadow-lg transition-shadow border-purple-100">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-purple-800">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600">
              Find the perfect role that matches your skills and passion
            </p>
          </div>

          <div className="grid gap-8">
            {jobs.filter(job => job.isActive).map((job) => (
              <Card key={job._id} className="hover:shadow-lg transition-shadow bg-white border-purple-100">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl text-purple-800 mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {job.experience}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Open
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-purple-700 mb-2">Job Description</h4>
                      <p className="text-gray-700">{job.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-purple-700 mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-purple-700 mb-2">Responsibilities</h4>
                      <ul className="space-y-1">
                        {job.responsibilities.map((resp, index) => (
                          <li key={index} className="flex items-start">
                            <Star className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-700 mb-2">What We Offer</h4>
                      <ul className="space-y-1">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="text-blue-700 text-sm">• {benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <div className="text-sm text-gray-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, preferredRole: job.title }));
                              setSelectedJob(job);
                            }}
                          >
                            Apply Now
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
            <p className="text-xl mb-8 opacity-90">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => setFormData(prev => ({ ...prev, preferredRole: "General Application" }))}
                >
                  Submit General Application
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Career;