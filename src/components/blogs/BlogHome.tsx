"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Loader } from "../loading/Loader"
import { Button } from "../ui/button"
import { Trash2, Plus, Search, Filter, SortAsc, EyeIcon } from "lucide-react"

import { CustomPagination } from "../utils/Pagination"
import { Switch } from "../ui/switch"
import { DeleteBlog } from "./DeleteBlog"
import { toast } from "sonner"
import HomeLoading from "../home/HomeLoading"
import { get } from "http"

interface Blog {
  _id: string
  title: string
  slug: string
  blogImage: string
  isActive: boolean
  isNewBlog: boolean
  blogViews: number
}

const BlogHome: React.FC = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [updateLoading, setUpdateLoading] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(8)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [search, setSearch] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [sort, setSort] = useState<string>("-createdAt")
  const [visibility, setVisibility] = useState<string>("all")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedBlogToDelete, setSelectedBlogToDelete] = useState<
    string | null
  >(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  // Fetch blogs data with filters
  const getBlogs = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/blogs/all-blogs`,
        {
          params: {
            page,
            limit,
            search,
            category,
            sort,
            visibility,
          },
        }
      )
      if (response.data.success) {
        setBlogs(response.data.data)
        // setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.log("Failed to fetch blog data")
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchChange = async (
    blogId: string,
    field: string,
    currentValue: boolean
  ) => {
    setUpdateLoading(blogId)
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL_DEV}/blogs/edit-blog-visibility/${blogId}`,
        { [field]: !currentValue }
      )

      if (response.data.success) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === blogId ? { ...blog, [field]: !currentValue } : blog
          )
        )
        // getBlogs()
      }
    } catch (error) {
      console.log("Failed to update status")
    } finally {
      setUpdateLoading(null)
    }
  }

  const handleDeleteClick = (blogId: string) => {
    setSelectedBlogToDelete(blogId)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true)
      if (selectedBlogToDelete) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL_DEV}/blogs/delete-blog/${selectedBlogToDelete}`
        )
        if (response.data.success) {
          setDeleteLoading(false)
          toast.success(response.data.message)
          getBlogs()
        } else {
          setDeleteLoading(false)
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      setDeleteLoading(false)
      toast.error("Failed to delete blog")
    } finally {
      setDeleteModalOpen(false)
    }
  }

  //debounce search
  useEffect(() => {
    const searchData = setTimeout(() => {
      getBlogs()
    }, 1000)
    return () => clearTimeout(searchData)
  }, [search])

  useEffect(() => {
    getBlogs()
  }, [page, limit, category, sort, visibility])

  return (
    <div className="p-8 bg-gray-50 min-h-screen w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Blog Manager</h2>
          <Button
            onClick={() => router.push("/blogs/add-blog")}
            className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Blog
          </Button>
        </div>
        <p className="text-gray-600">
          Manage your blog posts and their visibility options
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <SortAsc className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={visibility}
            onChange={(e) => {
              setVisibility(e.target.value)
              setPage(1)
            }}
          >
            <option value="all">Visibility (all)</option>
            <option value="isNewBlog">New</option>
            <option value="notNewBlog" className="text-blue-600">
              Not New
            </option>
            <option value="isActive">Active</option>
            <option value="notActive" className="text-red-600">
              Not Active
            </option>
          </select>
        </div>

        <div className="relative">
          <SortAsc className="absolute left-3 top-2 text-gray-400" size={20} />
          <select
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
          >
            <option value="">Sort by...</option>
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="blogViews">Views: Low to High</option>
            <option value="-blogViews">Views: High to Low</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs by title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Blogs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Blog Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Visibility Options
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={blog.blogImage}
                      alt={blog.title}
                      className="h-24 w-32 object-cover rounded-lg shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-500">@admin</p>
                      <span className=" flex gap-2 items-center text-primary">
                        <EyeIcon size={16} /> {blog.blogViews}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {/* new  */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      New
                    </span>
                    <Switch
                      checked={blog.isNewBlog}
                      disabled={updateLoading === blog._id}
                      onCheckedChange={() =>
                        handleSwitchChange(
                          blog._id,
                          "isNewBlog",
                          blog.isNewBlog
                        )
                      }
                    />
                  </div>
                  {/* {wellness.isActivated ? "Activated" : "Not Activated"}  */}
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className={`text-sm font-semibold ${
                        blog.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {blog.isActive ? "Activated" : "Not Activated"}
                    </span>
                    <Switch
                      checked={blog.isActive}
                      disabled={updateLoading === blog._id}
                      onCheckedChange={() =>
                        handleSwitchChange(blog._id, "isActive", blog.isActive)
                      }
                    />
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Button
                      onClick={() =>
                        router.push(`/blogs/edit-blog/${blog.slug}`)
                      }
                      className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(blog._id)}
                      className="px-4 py-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading and Empty States */}
      {/* Loading and Empty States */}
      {loading && (
        <div className="flex justify-center mt-40">
          <HomeLoading />
        </div>
      )}

      {!loading && blogs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
          <p className="text-2xl text-gray-400 font-medium">No blogs found</p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {blogs.length > 0 && (
        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Delete Modal */}
      <DeleteBlog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        loading={deleteLoading}
        itemName={
          blogs.find((b) => b._id === selectedBlogToDelete)?.title || ""
        }
      />
    </div>
  )
}

export default BlogHome
