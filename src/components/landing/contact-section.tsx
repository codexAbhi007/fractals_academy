"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Phone, Mail, Send, MapPin, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { contactData } from "@/lib/contact-data";
import { BackgroundBeams } from "@/components/ui/aceternity";

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: contactData.phone.display,
      href: `tel:${contactData.phone.link}`,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Mail,
      title: "Email",
      value: contactData.email,
      href: `mailto:${contactData.email}`,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: MapPin,
      title: "Location",
      value: contactData.location,
      href: "#",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Clock,
      title: "Hours",
      value: contactData.hours,
      href: "#",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <section ref={ref} className="relative py-10 overflow-hidden">
      <BackgroundBeams />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Transform
            </span>{" "}
            Your Math Journey?
          </h2>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in{" "}
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our courses? Want to enroll? We&apos;re here to
            help you on your mathematical journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="block"
                >
                  <Card className="border-white/10 bg-white/5 hover:bg-white/8 transition-all group cursor-pointer h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg ${info.bgColor} transition-all group-hover:scale-110 shrink-0`}
                        >
                          <info.icon className={`h-5 w-5 ${info.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">
                            {info.title}
                          </p>
                          <p className="font-medium text-sm break-all">
                            {info.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="pt-6 space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Quick Actions
              </h4>
              <div className="flex flex-wrap gap-3">
                <a href={`tel:${contactData.phone.link}`}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${contactData.whatsapp.number}?text=${encodeURIComponent(contactData.whatsapp.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="border-white/10">
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border-white/10 bg-white/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="border-white/10 bg-white/5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 12345 67890"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="border-white/10 bg-white/5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="min-h-32 border-white/10 bg-white/5"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
