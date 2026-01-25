import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookOpen, ArrowRight } from 'lucide-react';

interface CourseBasicInfo {
    slug: string;
    title: string;
    description: string;
    thumbnail: string;
}

// Featured courses to show prominently (curated list)
const FEATURED_COURSES = ['python', 'java', 'html-css', 'sql', 'angular'];

export default function CoursesIndex() {
    const [courses, setCourses] = useState<CourseBasicInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

    const handleImageError = (slug: string) => {
        setBrokenImages(prev => ({ ...prev, [slug]: true }));
    };

    useEffect(() => {
        async function loadCourses() {
            const courseData: CourseBasicInfo[] = [];

            // Load manifests for featured courses
            for (const slug of FEATURED_COURSES) {
                try {
                    const response = await fetch(`/courses/${slug}/manifest.json`);
                    if (response.ok) {
                        const manifest = await response.json();
                        courseData.push({
                            slug: manifest.slug,
                            title: manifest.title,
                            description: manifest.description || 'პროგრამირების კურსი',
                            thumbnail: manifest.thumbnail
                        });
                    }
                } catch (error) {
                    console.error(`Failed to load course ${slug}:`, error);
                }
            }

            setCourses(courseData);
            setLoading(false);
        }

        loadCourses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">კურსები იტვირთება...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 px-4 py-2 text-sm font-semibold">
                            <BookOpen className="w-4 h-4 mr-2" />
                            უფასო კურსები
                        </Badge>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
                            ისწავლე პროგრამირება <span className="text-secondary">უფასოდ</span>
                        </h1>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            აირჩიე შენთვის სასურველი კურსი და დაიწყე სწავლა დღესვე.
                        </p>
                    </div>

                    {/* Course Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Link
                                key={course.slug}
                                to={`/courses/${course.slug}`}
                                className="group block"
                            >
                                <Card className="overflow-hidden border-2 border-primary/10 hover:border-secondary/50 transition-all duration-300 h-full">
                                    {/* Thumbnail */}
                                    <div className="aspect-video overflow-hidden bg-muted">
                                        {course.thumbnail && !brokenImages[course.slug] ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={() => handleImageError(course.slug)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                <BookOpen className="w-12 h-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-secondary transition-colors">
                                            {course.title}
                                        </h2>
                                        <p className="text-text-secondary text-sm line-clamp-2 mb-4">
                                            {course.description}
                                        </p>
                                        <div className="flex items-center text-secondary font-medium text-sm">
                                            კურსის ნახვა
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* AI Course Promo */}
                    <div className="mt-16">
                        <Card className="p-8 bg-gradient-to-r from-purple-900/20 to-primary/20 border-2 border-purple-500/30">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1">
                                    <Badge className="mb-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
                                        ახალი კურსი
                                    </Badge>
                                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                                        AI აგენტები & ავტომატიზაცია
                                    </h3>
                                    <p className="text-text-secondary mb-4">
                                        ისწავლე ChatGPT, n8n და AI აგენტების შექმნა. გახდი AI არქიტექტორი!
                                    </p>
                                    <Link
                                        to="/ai"
                                        className="inline-flex items-center text-purple-400 font-medium hover:text-purple-300 transition-colors"
                                    >
                                        გაიგე მეტი
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
