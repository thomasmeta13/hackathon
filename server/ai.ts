// Integration: blueprint:javascript_openai
import OpenAI from "openai";

// Use the newest OpenAI model which is "gpt-5" released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateTaskHelp(taskTitle: string, taskDescription: string, userInput: string): Promise<string> {
  if (!openai) {
    // Return a helpful mock response for testing
    console.log('No OpenAI API key found, using mock response');
    console.log('Task:', taskTitle, 'Question:', userInput);
    
    // Generate contextual responses based on the question
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('start') || lowerInput.includes('begin')) {
      return `Start by reading the description, then break it into steps. What's your biggest question?`;
    }
    
    if (lowerInput.includes('tool') || lowerInput.includes('need')) {
      return `You'll need design software like Canva or Figma, plus the brand assets. What do you have already?`;
    }
    
    if (lowerInput.includes('step') || lowerInput.includes('guidance')) {
      return `Plan it out, design mockups, create the graphics, test them, then export. Which step are you on?`;
    }
    
    // Handle simple greetings and short questions
    if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
      return `Hey! Ready to tackle "${taskTitle}"? What's your first question?`;
    }
    
    if (lowerInput.includes('can i') || lowerInput.includes('can you')) {
      return `Absolutely! "${taskTitle}" is totally doable. What's your main worry?`;
    }
    
    // Handle more specific questions
    if (lowerInput.includes('help') || lowerInput.includes('stuck')) {
      return `I'm here to help! What's got you stuck on "${taskTitle}"?`;
    }
    
    if (lowerInput.includes('time') || lowerInput.includes('long')) {
      return `Depends on your experience, but probably a few hours to a day. What's your timeline?`;
    }
    
    // Default response
    return `I can help with "${taskTitle}"! What specific part do you need help with?`;
  }

  try {
    const prompt = `Chat assistant. 1-2 sentences only. NO LISTS. NO STEPS. NO BULLETS.

Task: ${taskTitle}
Question: ${userInput}

Short answer + question. That's it.

JSON: {"response": "short answer here"}`;

    const completion = await openai.chat.completions.create({
  ok 
      model: "gpt-3.5-turbo", // Using GPT-3.5 for more concise responses
      messages: [
        {
          role: "system",
          content: "Chat assistant. 1-2 sentences only. NO LISTS. NO STEPS. NO BULLETS. NO LONG TEXT. Be casual. End with a question."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 40,
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"response": "I can help you with this task! Please provide more specific details about what you need assistance with."}');
    
    console.log('Raw AI response:', result.response);
    
    // Force short responses - NUCLEAR OPTION
    let response = result.response;
    
    // Remove ALL formatting and lists
    response = response.replace(/\d+\.\s*/g, '');
    response = response.replace(/\*\*[^*]+\*\*/g, '');
    response = response.replace(/•\s*/g, '');
    response = response.replace(/:\s*/g, ' ');
    response = response.replace(/\n/g, ' ');
    response = response.replace(/\s+/g, ' ');
    
    // Find the first sentence that ends with a period
    const firstSentenceMatch = response.match(/^[^.!?]*[.!?]/);
    if (firstSentenceMatch) {
      response = firstSentenceMatch[0];
    } else {
      // If no sentence ending, just take first 50 characters
      response = response.substring(0, 50) + "...";
    }
    
    // If still too long, cut it off brutally
    if (response.length > 80) {
      response = response.substring(0, 77) + "...";
    }
    
    // Add a question
    if (!response.includes('?')) {
      response += " What do you need help with?";
    }
    
    console.log('Final processed response:', response);
    return response;
  } catch (error) {
    console.error("Error generating AI help:", error);
    throw new Error("Failed to generate AI assistance");
  }
}

export async function generateOrganizationAssistantResponse(message: string, context: any): Promise<string> {
  if (!openai) {
    // Return a helpful mock response for testing
    console.log('No OpenAI API key found, using mock response');
    console.log('Message:', message, 'Context:', context);
    
    const lowerMessage = message.toLowerCase();
    const completionRate = context.performance?.completionRate || 87;
    const activeMembers = context.performance?.activeMembers || 45;
    const avgTaskTime = context.performance?.avgTaskTime || "2.3h";
    const totalTasks = context.performance?.totalTasks || 12;
    const completedTasks = context.performance?.completedTasks || 0;
    const userName = context.userName || "Organizer";
    const organizationName = context.organizationName || "HTW Organization";
    const recentTasksCount = context.recentTasks?.length || 0;
    
    // Handle common organization assistant queries with dynamic context
    if (lowerMessage.includes('completion') || lowerMessage.includes('rate')) {
      return `Your ${completionRate}% completion rate is ${completionRate >= 85 ? 'excellent' : completionRate >= 70 ? 'good' : 'needs improvement'}! ${completionRate < 85 ? 'Try breaking complex tasks into smaller chunks.' : 'Consider increasing task complexity to challenge your team.'} What specific metrics interest you?`;
    }
    
    if (lowerMessage.includes('task') && (lowerMessage.includes('create') || lowerMessage.includes('suggest'))) {
      return `With ${activeMembers} active members and ${totalTasks} tasks, I recommend focusing on Marketing and Design tasks. These show 92% completion rates. What type of tasks are you planning?`;
    }
    
    if (lowerMessage.includes('engagement') || lowerMessage.includes('community')) {
      return `Your community engagement looks ${activeMembers >= 40 ? 'strong' : 'growing'} with ${activeMembers} active members! Consider hosting regular check-ins. How can we boost participation?`;
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('analytics')) {
      return `Your organization shows ${completionRate}% completion rate and ${avgTaskTime} avg task time. The key is clear communication and adequate rewards. What area interests you?`;
    }
    
    if (lowerMessage.includes('htw') || lowerMessage.includes('honolulu')) {
      return `For HTW 2025, focus on tasks that showcase local talent and build community connections. Marketing tasks work particularly well. What HTW goals do you have?`;
    }
    
    if (lowerMessage.includes('members') || lowerMessage.includes('team')) {
      return `You have ${activeMembers} active members managing ${totalTasks} tasks. Consider creating more collaborative tasks to increase engagement. What's your team focus?`;
    }
    
    // Handle greetings with context
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return `Hi ${userName}! I'm here to help optimize ${organizationName} with ${activeMembers} members and ${completionRate}% completion rate. What would you like to work on?`;
    }
    
    if (lowerMessage.includes('suggest') || lowerMessage.includes('recommend')) {
      return `Based on your ${completedTasks} completed tasks and ${recentTasksCount} recent tasks, I recommend focusing on Marketing and Design tasks. What specific areas interest you?`;
    }
    
    // Default response with dynamic context
    return `I can help with task creation, performance analysis, and community engagement. ${organizationName} shows great potential with ${completionRate}% completion rates! What area interests you?`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant for Honolulu Tech Week organization management. You help optimize task creation, analyze performance metrics, and improve community engagement. Be conversational, specific, and actionable. MAXIMUM 2 sentences. Always end with a question. Keep responses under 60 words. Respond ONLY with valid JSON in this exact format: {\"response\": \"your message here\"}"
        },
        {
          role: "user", 
          content: `Organization: ${context.organizationName || "HTW Organization"} | User: ${context.userName || "Organizer"} (${context.userRole || "organizer"}) | Stats: ${context.performance?.activeMembers || 0} members, ${context.performance?.completionRate || 0}% completion, ${context.performance?.avgTaskTime || "0h"} avg time, ${context.performance?.totalTasks || 0} total tasks, ${context.performance?.completedTasks || 0} completed | Recent tasks: ${context.recentTasks?.length || 0} | Message: "${message}" | Respond ONLY with valid JSON: {"response": "your message"}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 40,
      temperature: 0.3,
    });

    let result;
    try {
      const rawContent = completion.choices[0].message.content || '{"response": "I can help you with organization management! What would you like to focus on?"}';
      result = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw content:', completion.choices[0].message.content);
      // Fallback to a simple response
      result = { response: "I can help you with organization management! What would you like to focus on?" };
    }
    
    console.log('Raw AI response:', result.response);
    
    // Force short responses - NUCLEAR OPTION
    let response = result.response;
    
    // Remove ALL formatting and lists
    response = response.replace(/\d+\.\s*/g, '');
    response = response.replace(/\*\*[^*]+\*\*/g, '');
    response = response.replace(/•\s*/g, '');
    response = response.replace(/:\s*/g, ' ');
    response = response.replace(/\n/g, ' ');
    response = response.replace(/\s+/g, ' ');
    
    // Find the first sentence that ends with a period
    const firstSentenceMatch = response.match(/^[^.!?]*[.!?]/);
    if (firstSentenceMatch) {
      response = firstSentenceMatch[0];
    } else {
      // If no sentence ending, just take first 60 characters
      response = response.substring(0, 60) + "...";
    }
    
    // If still too long, cut it off brutally
    if (response.length > 80) {
      response = response.substring(0, 77) + "...";
    }
    
    // Add a question if none exists
    if (!response.includes('?')) {
      response += " What can I help you with?";
    }
    
    console.log('Final processed response:', response);
    return response;
  } catch (error) {
    console.error("Error generating organization assistant response:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generateInfographic(
  taskTitle: string, 
  taskDescription: string, 
  taskCategory: string, 
  iteration: number, 
  userFeedback: string | null, 
  currentPrompt?: string
): Promise<{ prompt: string; imageUrl: string; response: string }> {
  if (!openai) {
    // Return mock response for testing
    console.log('No OpenAI API key found, using mock response');
    
    const mockPrompts = [
      `A modern, professional infographic about "${taskTitle}". Clean design with blue and white color scheme, typography-focused layout, key statistics highlighted, suitable for social media sharing.`,
      `An engaging visual infographic showcasing "${taskTitle}" with vibrant colors, icons, and data visualization. Professional yet approachable design with clear hierarchy.`,
      `A minimalist infographic design for "${taskTitle}" featuring geometric shapes, modern typography, and a sophisticated color palette. Perfect for presentations and reports.`
    ];
    
    const mockImageUrls = [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=512&h=512&fit=crop',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=512&h=512&fit=crop'
    ];
    
    const promptIndex = iteration % mockPrompts.length;
    const imageIndex = iteration % mockImageUrls.length;
    
    let response = "I've generated a new infographic based on your feedback. The design incorporates the changes you requested while maintaining visual appeal and clarity.";
    
    if (userFeedback) {
      response = `I've updated the infographic based on your feedback: "${userFeedback}". The new design addresses your suggestions while keeping the core information clear and engaging.`;
    }
    
    return {
      prompt: mockPrompts[promptIndex],
      imageUrl: mockImageUrls[imageIndex],
      response: response
    };
  }

  try {
    // Generate DALL-E prompt based on task and feedback
    let prompt = currentPrompt || `A modern, professional infographic about "${taskTitle}". ${taskDescription}. Clean design with engaging visuals, clear typography, and a professional color scheme suitable for social media sharing.`;
    
    if (userFeedback && iteration > 0) {
      // Refine prompt based on user feedback
      const refinementPrompt = `Based on the user feedback "${userFeedback}", refine this DALL-E prompt for generating an infographic about "${taskTitle}": "${currentPrompt}". 
      
      Create a new prompt that addresses the feedback while maintaining the core purpose of the infographic. Focus on visual improvements, layout changes, or style adjustments as requested.`;
      
      const refinementCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at creating DALL-E prompts for infographics. Create clear, detailed prompts that will generate high-quality visual infographics."
          },
          {
            role: "user", 
            content: refinementPrompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });
      
      prompt = refinementCompletion.choices[0].message.content || prompt;
    }

    // Generate image with DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("Failed to generate image URL");
    }

    // Generate response message
    let responseMessage = "I've created a new infographic for you! The design incorporates the key information in a visually appealing format. You can provide feedback to refine it further.";
    
    if (userFeedback && iteration > 0) {
      responseMessage = `I've updated the infographic based on your feedback. The new version addresses your suggestions while maintaining clarity and visual appeal. Feel free to provide more feedback if you'd like further adjustments.`;
    }

    return {
      prompt: prompt,
      imageUrl: imageUrl,
      response: responseMessage
    };

  } catch (error) {
    console.error("Error generating infographic:", error);
    throw new Error("Failed to generate infographic");
  }
}