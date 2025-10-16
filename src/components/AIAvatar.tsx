import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Minimize2, Maximize2, Bot, User, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  conversation_id?: string;
  user_id?: string;
  metadata?: any;
}

const AIAvatar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && isOpen && !conversationId) {
      initializeConversation();
    }
  }, [user, isOpen]);

  const initializeConversation = async () => {
    if (!user) return;

    try {
      // Check for existing conversation
      const { data: existingConversations, error: fetchError } = await supabase
        .from('chat_conversations')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      let convId = existingConversations?.[0]?.id;

      if (!convId) {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            title: 'Currency Chat'
          })
          .select('id')
          .single();

        if (createError) throw createError;
        convId = newConversation.id;

        // Add welcome message
        await supabase
          .from('chat_messages')
          .insert({
            conversation_id: convId,
            user_id: user.id,
            role: 'assistant',
            content: "Hi! I'm Alex, your AI currency advisor. I can help with exchange rates, market insights, and travel money tips. What would you like to know?"
          });
      }

      setConversationId(convId);
      await fetchMessages(convId);
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user || !conversationId) return;

    const messageContent = inputValue;
    setInputValue('');
    setLoading(true);

    try {
      // Save user message
      const { error: userMsgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'user',
          content: messageContent
        });

      if (userMsgError) throw userMsgError;

      // Refresh messages to show user message
      await fetchMessages(conversationId);

      // Call AI avatar edge function
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('ai-avatar', {
        body: {
          message: messageContent,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        }
      });

      if (aiError) throw aiError;

      // Save AI response
      const { error: aiMsgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          role: 'assistant',
          content: aiResponse.response || aiResponse.reply || 'Sorry, I encountered an error.'
        });

      if (aiMsgError) throw aiMsgError;

      // Refresh messages to show AI response
      await fetchMessages(conversationId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('rate') || input.includes('exchange')) {
      return "Current EUR/USD is at 1.0850 (+0.2% today). The ECB meeting next week could cause volatility. Would you like me to set up a rate alert for you?";
    } else if (input.includes('travel') || input.includes('trip')) {
      return "For travel money, I recommend getting 80% in advance and 20% locally for better rates. Avoid airport exchanges - they typically charge 5-8% more. Which destination are you considering?";
    } else if (input.includes('best') || input.includes('cheap')) {
      return "Right now, Southeast Asia offers great value with USD strength. Thailand (THB), Vietnam (VND), and Malaysia (MYR) are particularly cost-effective. Want specific cost breakdowns?";
    } else if (input.includes('invest') || input.includes('portfolio')) {
      return "Currency diversification is smart! Consider 40% USD, 25% EUR, 20% JPY, and 15% emerging markets. I can help you track performance and rebalancing. What's your risk tolerance?";
    } else if (input.includes('news') || input.includes('what')) {
      return "Big moves today: USD gaining on Fed hawkish comments, GBP volatile on inflation data, and JPY intervention rumors. The market is watching tomorrow's US employment numbers. Need details on any specific pair?";
    } else {
      return "I can help with currency rates, travel money tips, market analysis, and investment strategies. Try asking about exchange rates, travel destinations, or market news!";
    }
  };

  const quickQuestions = [
    "Best travel destinations right now?",
    "EUR/USD forecast this week?",
    "Cheapest way to send money abroad?",
    "How to protect against currency risk?"
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-96 flex flex-col shadow-2xl z-50 border-2">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border-2 border-primary-foreground">
                <AvatarFallback className="bg-primary-foreground text-primary text-xs font-bold">
                  AI
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">Alex - Currency AI</h3>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  Online • Instant responses
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                 <Avatar className="h-6 w-6 flex-shrink-0">
                   <AvatarFallback className="text-xs">
                     {message.role === 'assistant' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                   </AvatarFallback>
                 </Avatar>
                 <div
                   className={`max-w-[80%] rounded-lg p-3 text-sm ${
                     message.role === 'user'
                       ? 'bg-primary text-primary-foreground'
                       : 'bg-accent text-accent-foreground'
                   }`}
                 >
                   {message.content}
                 </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-muted-foreground mb-2">Quick questions:</div>
              <div className="grid grid-cols-1 gap-1">
                {quickQuestions.slice(0, 2).map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 justify-start p-2"
                     onClick={() => setInputValue(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about currencies, rates, travel..."
                className="text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
               <Button
                 onClick={handleSendMessage}
                 size="icon"
                 className="h-9 w-9 flex-shrink-0"
                 disabled={!inputValue.trim() || loading}
               >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Real-time market data • Powered by AI</span>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export { AIAvatar };