import { useState, useEffect } from "react" // Added useEffect
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useDatabase } from "../hooks/useDatabase.js"
import { ProfileTypes } from "../types/index.js"
import { Search, Star, Clock, Shield, Mic } from "lucide-react"

export default function SkillBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [maxPrice, setMaxPrice] = useState([500])
  const [isVoiceSearch, setIsVoiceSearch] = useState(false)

  const { searchProviders, searchSkills, skills } = useDatabase() // Changed skills to searchSkills
  const [fetchedProviders, setFetchedProviders] = useState([])
  const [fetchedSkills, setFetchedSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const providersData = await searchProviders(searchQuery, maxPrice[0])
        setFetchedProviders(providersData)

        const skillsData = await searchSkills(searchQuery, selectedCategory, maxPrice[0]) // Fetch skills based on filters
        setFetchedSkills(skillsData)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Failed to load data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, selectedCategory, maxPrice, searchProviders, searchSkills])

  const categories = ["All", "Coding", "Design", "Documents", "Analytics", "Writing"]

  const handleVoiceSearch = () => {
    setIsVoiceSearch(!isVoiceSearch)
    if (!isVoiceSearch) {
      // Simulate voice search
      setTimeout(() => {
        setSearchQuery("python programming help")
        setIsVoiceSearch(false)
      }, 2000)
    }
  }

  const filteredProviders = fetchedProviders.filter(
    (provider) =>
      !selectedCategory ||
      selectedCategory === "All" ||
      (provider.skills && provider.skills.some( // Check if provider.skills exists
        (skill) =>
          fetchedSkills.find((s) => s.name.toLowerCase().includes(skill.toLowerCase()))?.category === selectedCategory,
      )),
  )

  const getProfileTypeDisplay = (profileType) => {
    switch (profileType) {
      case ProfileTypes.STUDENT:
        return "🎓"
      case ProfileTypes.GRADUATE:
        return "👨‍🎓"
      case ProfileTypes.PROFESSIONAL:
        return "💼"
      default:
        return "👤"
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        Loading skills and providers...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="E.g., 'Fix my Java code'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12"
            />
            <Button
              size="sm"
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 ${
                isVoiceSearch ? "bg-red-500 animate-pulse" : "bg-purple-500"
              }`}
              onClick={handleVoiceSearch}
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>

          {isVoiceSearch && (
            <div className="text-center py-4">
              <div className="flex justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-500 rounded animate-pulse"
                    style={{
                      height: Math.random() * 20 + 10,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Listening... Describe your task</p>
            </div>
          )}

          {/* Category Filters */}
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category === selectedCategory ? "" : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-medium mb-3">Max Hourly Rate: ₹{maxPrice[0]}</h3>
            <Slider value={maxPrice} onValueChange={setMaxPrice} max={1000} min={100} step={50} className="w-full" />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>₹100</span>
              <span>₹1000</span>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer">
              <Clock className="w-3 h-3 mr-1" />
              1-Hour Delivery
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              <Shield className="w-3 h-3 mr-1" />
              Verified Only
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              <Star className="w-3 h-3 mr-1" />
              Top Rated
            </Badge>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{filteredProviders.length} Skilled Experts Found</h2>
        <p className="text-gray-600">{searchQuery && `Results for "${searchQuery}"`}</p>
      </div>

      {/* Provider Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={provider.avatar_url || "/placeholder.svg"} // Use avatar_url
                  alt={provider.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <span className="text-lg">{getProfileTypeDisplay(provider.profile_type)}</span> {/* Use profile_type */}
                  </div>
                  <p className="text-sm text-gray-600">{provider.college || provider.company}</p>
                </div>
                {provider.is_verified && <Shield className="w-5 h-5 text-green-500" />} {/* Use is_verified */}
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {provider.skills && provider.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {provider.skills && provider.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{provider.skills.length - 3}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{provider.bio}</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{(provider.rating || 0).toFixed(1)}</span> {/* Use rating */}
                  <span className="text-gray-500 text-sm ml-1">({provider.completed_tasks || 0})</span> {/* Use completed_tasks */}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">₹{provider.hourly_rate}/hr</div> {/* Use hourly_rate */}
                  <div className="text-xs text-gray-500">98% Success</div>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-700">Hire Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600 mb-4">
              Try broadening your search criteria or check back later for new providers.
            </p>
            <Button variant="outline">Clear Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
